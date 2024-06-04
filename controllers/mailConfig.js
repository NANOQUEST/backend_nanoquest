import nodemailer from 'nodemailer';

export const configureMail = async () => {
    try {
        let smtpAuth = {
            user: "nanoquest43@gmail.com",
            pass: "uied mssc ytff sapn",
        };
        let smtpConfig = {
            service: 'gmail',
            auth: smtpAuth,
        };
        let transporter = nodemailer.createTransport(smtpConfig);

        // Verify transporter
        await transporter.verify();
        
        console.log("Mail transporter configured successfully");
        
        return transporter;
    } catch (error) {
        console.error("Error configuring mail transporter:", error);
        throw error;
    }
};
