import nodemailer from 'nodemailer';

export const configuremail = async () => {
    try {
        let smtpAuth = {
            user: "nanoquest43@gmail.com",
            pass: "uied mssc ytff sapn",
        };
        let smtpConfig = {
            service: 'gmail',
            port: 465,
            secure: true,
            auth: smtpAuth,
            tls: {
                rejectUnAuthorized: true
            }
        };
        let transporter = nodemailer.createTransport(smtpConfig);

        // Verify transporter
        await transporter.verify();
        
        return transporter;
    } catch (error) {
        console.error("Error configuring mail:", error);
        throw error;
    }
};

export const sendLoginMail = async (transporter,email,link) => {
    if (!email) {
            throw new Error("No recipient email address provided");
        }
    try {
        const info = await transporter.sendMail({
            from: "nanoquest43@gmail.com",
            to:email,
            subject: "Reset Password",
            html:`Reset your password by using this link:${link}`,
        });
        console.log("Message sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending login mail:", error);
        throw error;
    }
};
