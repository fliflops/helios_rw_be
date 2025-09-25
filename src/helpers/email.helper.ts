import transporter from "../utils/mailer";

interface EmailPassword {
    email: string;
    first_name: string;
    password: string;
}

export default async function sendMail({ email, first_name, password}: EmailPassword) {
    return await transporter.sendMail({
        to: email,
        subject: '[Helios: New Account]',
        html: `<p>Dear ${first_name},</p>
            <p>Below are your credentials to access Helios:</p>
            <p>Helios Link: ''</p>
            <p>User ID: ${email}</p>
            <p>Temporary Password: ${password}</p>
            <br/>
            <p>Please log in and follow the instructions to
            secure your account by changing your
            password.</p>
            <br/>
            <p>Regards, 
            Helios IT Team</p>`
    });
}
