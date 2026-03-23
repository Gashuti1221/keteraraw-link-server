import { redirect } from "next/navigation";

export default function Home() {
  // This happens on the server instantly by redirecting the user to the Play Store page for the Keteraraw app
  redirect("https://play.google.com/store/apps/details?id=com.savvybridge.keteraraw");
}