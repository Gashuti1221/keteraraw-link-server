import { redirect } from "next/navigation";

export default function Home() {
  // This happens on the server instantly
  redirect("https://play.google.com/store/apps/details?id=com.savvybridge.keteraraw");
}