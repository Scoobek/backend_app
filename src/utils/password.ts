import bcrypt from "bcrypt";

export function hashPassword(password: string) {
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds);
}

export async function comparePasswords(
    password: string,
    hashedPassword: string
) {
    return await bcrypt.compare(password, hashedPassword);
}
