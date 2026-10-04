import { notFound } from "next/navigation";
import Editor from "../../../../../components/admin/Editor";
import { SINGLETONS, getSingleton } from "../../../../../lib/store";

export default async function SettingsPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (!SINGLETONS[name]) notFound();
  return (
    <>
      <div className="top"><div><h1>{SINGLETONS[name].label}</h1><p className="sub">{name === "home" ? "Intro, chips, counters, research and which sections appear." : name === "theme" ? "Colours, fonts, corner roundness, and every animation switch. Saves apply in seconds." : "Name, photo, links, CV, navigation."}</p></div></div>
      <Editor kind="singleton" name={name} data={await getSingleton(name)} viewHref="/" />
    </>
  );
}
