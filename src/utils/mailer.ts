import configs from "../configs";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: configs.mailer.email,
        pass: configs.mailer.password,
    }
});

export default transporter;