import "dotenv/config";

import app from "@/app.js";
import { env } from "@/config/env.js";

const PORT = env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
