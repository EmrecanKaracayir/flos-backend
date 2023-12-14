import jwt from "jsonwebtoken";
import { AuthPayload } from "../@types/helpers/authPayloadRules";
import { TOKEN_EXPIRATION_TIME } from "../utils/constants";

export class AuthHelper {
  public static generateToken(authPayload: AuthPayload): string {
    return jwt.sign(authPayload, process.env.JWT_SECRET as string, {
      expiresIn: TOKEN_EXPIRATION_TIME,
    });
  }

  public static verifyToken(token: string): AuthPayload {
    return jwt.verify(token, process.env.JWT_SECRET as string) as AuthPayload;
  }
}
