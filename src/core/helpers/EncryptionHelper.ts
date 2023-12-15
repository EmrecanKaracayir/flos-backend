import bcrypt from "bcrypt";

export class EncryptionHelper {
  public static async encrypt(data: string): Promise<Promise<string>> {
    const salt: string = await bcrypt.genSalt();
    return await bcrypt.hash(data, salt);
  }

  public static async compare(
    data: string,
    encryptedData: string,
  ): Promise<boolean> {
    return await bcrypt.compare(data, encryptedData);
  }
}
