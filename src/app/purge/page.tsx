import { purgeCache } from "./actions";

export default async function Purge({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <form
      action={purgeCache}
      method="post"
      className="flex flex-col gap-4 p-2 mt-24 mx-auto max-w-96"
    >
      <input
        type="password"
        name="password"
        placeholder="Password"
        className="p-2 border rounded-xs"
      />
      {error && <p className="text-red-500">wrong password mate</p>}
      <button type="submit" className="p-2 border rounded-xs">
        Purge
      </button>
    </form>
  );
}
