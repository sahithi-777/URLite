import {UAParser} from "ua-parser-js";
import supabase from "./supabase";



export async function getClicksForUrls(urlIds) {
  const {data, error} = await supabase
    .from("clicks")
    .select("*")
    .in("url_id", urlIds);

  if (error) {
    console.error("Error fetching clicks:", error);
    return null;
  }

  return data;
}

export async function getClicksForUrl(url_id) {
  const {data, error} = await supabase
    .from("clicks")
    .select("*")
    .eq("url_id", url_id);

  if (error) {
    console.error(error);
    throw new Error("Unable to load Stats");
  }

  return data;
}

const parser = new UAParser();

// FIXED: Properly destructure parameters and ensure all fields are captured
// apiClicks.js
// export const storeClicks = async ({id, originalUrl}) => {
//   try {
//     const res = parser.getResult();
//     const device = res.type || "desktop";

//     // Optional: Use a timeout for the IP fetch so it doesn't hang the redirect
//     const response = await fetch("https://ipapi.co/json").catch(() => null);
//     const locationData = response ? await response.json() : {};

//     await supabase.from("clicks").insert({
//       url_id: id,
//       city: locationData.city || "Unknown",
//       country: locationData.country_name || "Unknown",
//       device: device,
//     });
//   } catch (error) {
//     console.error("Error recording click:", error);
//   } finally {
//     // ALWAYS redirect, regardless of success or failure of the stats recording
//     window.location.href = originalUrl;
//   }
// };
// apiClicks.js
export const storeClicks = async ({id, originalUrl}) => {
  try {
    const res = parser.getResult();
    const device = res.type || "desktop";

    // Optional: Use a timeout for the IP fetch so it doesn't hang the redirect
    const response = await fetch("https://ipapi.co/json").catch(() => null);
    const locationData = response ? await response.json() : {};

    await supabase.from("clicks").insert({
      url_id: id,
      city: locationData.city || "Unknown",
      country: locationData.country_name || "Unknown",
      device: device,
    });
  } catch (error) {
    console.error("Error recording click:", error);
  } finally {
    // ALWAYS redirect, regardless of success or failure of the stats recording
    window.location.href = originalUrl;
  }
};
