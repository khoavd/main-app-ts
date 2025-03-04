export function authorize(id: string | undefined): Promise<string[]> {
  return new Promise((resolve) => setTimeout(() => resolve(["admin"]), 1000));
}
