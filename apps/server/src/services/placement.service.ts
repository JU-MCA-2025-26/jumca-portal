import prisma from "@/config/prisma.js";

function parseLPA(ctc: string | null | undefined): number {
  if (!ctc) return 0;

  const match = ctc.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}

// Bucket a CTC value into a salary band label
function toBand(lpa: number): string {
  if (lpa < 10) return "6-10";
  if (lpa < 15) return "10-15";
  if (lpa < 20) return "15-20";
  if (lpa < 30) return "20-30";
  return "30+";
}

export class PlacementService {
  // Get overall placement statistics for the dashboard
  async getPlacementStats() {
    const [companiesCount, offersRaw, eligibleCount, drives] = await Promise.all([
      // Companies that have at least one placement drive
      prisma.company.count({
        where: {
          drives: {
            some: {},
          },
        },
      }),

      // All successful offers
      prisma.placementOffer.findMany({
        where: {
          status: "OFFERED",
        },
        select: {
          ctc: true,
          role: true,
          drive: {
            select: {
              company: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      }),

      // Active students are considered eligible
      prisma.user.count({
        where: {
          role: "STUDENT",
          isActive: true,
        },
      }),

      // Drives with their successful offers
      prisma.placementDrive.findMany({
        select: {
          driveDate: true,
          offers: {
            where: {
              status: "OFFERED",
            },
            select: {
              id: true,
            },
          },
        },
      }),
    ]);

    // CTC ANALYTICS
    const offersCount = offersRaw.length;

    let highestCTC = "—";
    let highestCTCSource = "";
    let averageCTC = "—";

    if (offersCount > 0) {
      // Find highest CTC
      const sortedOffers = [...offersRaw].sort((a, b) => parseLPA(b.ctc) - parseLPA(a.ctc));

      const highestOffer = sortedOffers[0];

      if (highestOffer) {
        highestCTC = highestOffer.ctc;
        highestCTCSource = `${highestOffer.drive.company.name} — ${highestOffer.role}`;
      }

      // Calculate average CTC
      const totalLPA = offersRaw.reduce((sum, offer) => sum + parseLPA(offer.ctc), 0);

      const avgLPA = totalLPA / offersCount;

      averageCTC = `${avgLPA.toFixed(1)} LPA`;
    }

    // YEARLY PLACEMENT STATS
    const yearMap = new Map<number, number>();

    for (const drive of drives) {
      if (!drive.driveDate) continue;

      const year = new Date(drive.driveDate).getFullYear();
      const currentCount = yearMap.get(year) ?? 0;

      yearMap.set(year, currentCount + drive.offers.length);
    }

    // Build a contiguous 5-year window ending at current year.
    const currentYear = new Date().getFullYear();

    const yearlyStats = Array.from({ length: 5 }, (_, index) => {
      const year = currentYear - 4 + index;

      return {
        year,
        placed: yearMap.get(year) ?? 0,
        total: eligibleCount,
      };
    });

    const bandMap: Record<string, number> = {
      "6-10": 0,
      "10-15": 0,
      "15-20": 0,
      "20-30": 0,
      "30+": 0,
    };

    for (const offer of offersRaw) {
      const lpa = parseLPA(offer.ctc);
      const band = toBand(lpa);

      bandMap[band] = (bandMap[band] ?? 0) + 1;
    }

    const salaryBands = Object.entries(bandMap).map(([label, count]) => ({
      label,
      count,
    }));

    return {
      companiesCount,
      offersCount,
      eligibleCount,
      highestCTC,
      highestCTCSource,
      averageCTC,
      yearlyStats,
      salaryBands,
    };
  }

  /**
   * Get placement drives.
   *
   * Optional sector filter:
   * - undefined / "ALL" => all drives
   * - otherwise filters by sector
   */
  async getPlacementDrives(sector?: string) {
    const normalizedSector = sector?.trim().toUpperCase();

    const where =
      normalizedSector && normalizedSector !== "ALL"
        ? {
            sector: normalizedSector,
          }
        : {};

    const drives = await prisma.placementDrive.findMany({
      where,
      orderBy: [
        {
          driveDate: "asc",
        },
      ],
      select: {
        id: true,
        role: true,
        minCTC: true,
        maxCTC: true,
        minCGPA: true,
        driveDate: true,
        status: true,
        sector: true,

        company: {
          select: {
            id: true,
            name: true,
            sector: true,
            logoUrl: true,
            website: true,
          },
        },
      },
    });

    const STATUS_ORDER: Record<string, number> = {
      ACTIVE: 0,
      UPCOMING: 1,
      CLOSED: 2,
    };

    return drives.sort((a, b) => (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99));
  }

  //Get a single placement drive by ID.
  async getDriveById(id: string) {
    const drive = await prisma.placementDrive.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
        role: true,
        minCTC: true,
        maxCTC: true,
        minCGPA: true,
        driveDate: true,
        status: true,
        sector: true,
        jd: true,
        applyLink: true,
        description: true,

        company: {
          select: {
            id: true,
            name: true,
          },
        },

        // Resources attached to this drive
        resources: {
          orderBy: {
            createdAt: "desc",
          },

          select: {
            id: true,
            title: true,
            fileUrl: true,
            type: true,
            createdAt: true,
          },
        },

        // Students who received an offer through this drive
        offers: {
          where: {
            status: "OFFERED",
          },

          select: {
            ctc: true,
            role: true,
            status: true,

            user: {
              select: {
                id: true,
                fullName: true,
                rollNumber: true,

                profile: {
                  select: {
                    avatarUrl: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!drive) {
      return null;
    }

    // Transform PlacementOffer[] into the structure expected by the frontend.
    const placedAlumni = drive.offers.map((offer) => ({
      id: offer.user.id,
      fullName: offer.user.fullName,
      rollNumber: offer.user.rollNumber,
      profile: offer.user.profile,

      offer: {
        ctc: offer.ctc,
        role: offer.role,
        status: offer.status,
      },
    }));

    const { offers: _offers, ...driveWithoutOffers } = drive;

    return {
      ...driveWithoutOffers,
      placedAlumni,
    };
  }
}

export default new PlacementService();
