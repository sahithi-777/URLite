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

const ipinfoToken = import.meta.env.VITE_IPINFO_TOKEN;
const regionNames = new Intl.DisplayNames(["en"], {type: "region"});

const getCountryName = (code) => {
  if (!code) return "Unknown";
  try {
    return regionNames.of(code) || code;
  } catch {
    return code;
  }
};

export const storeClicks = async ({id}) => {
  try {
    const res = parser.getResult();
    const device = res.type || "desktop";

    const response = ipinfoToken
      ? await fetch(`https://ipinfo.io/json?token=${ipinfoToken}`).catch(
          () => null
        )
      : null;
    const locationData = response ? await response.json() : {};

    await supabase.from("clicks").insert({
      url_id: id,
      city: locationData.city || "Unknown",
      country: getCountryName(locationData.country),
      device: device,
    });
  } catch (error) {
    console.error("Error recording click:", error);
  }
};
