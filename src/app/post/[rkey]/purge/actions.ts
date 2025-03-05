"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function purgeCache(formData: FormData) {
  const rkey = formData.get("rkey")!;
  const password = formData.get("password");
  if (password === process.env.PURGE_PASSWORD) {
    revalidatePath(`/post/${rkey}`, "page");
    redirect(`/post/${rkey}`);
  } else {
    console.error(`Invalid password: ${password}`);
    redirect(`/post/${rkey}/purge?error=yeah`);
  }
}
