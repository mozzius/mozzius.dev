"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function purgeCache(formData: FormData) {
  const password = formData.get("password");
  if (password === process.env.PURGE_PASSWORD) {
    revalidatePath("/", "page");
    revalidatePath("/post/[rkey]", "page");
    redirect("/");
  } else {
    console.error(`Invalid password: ${password}`);
    redirect("/purge?error=yeah");
  }
}
