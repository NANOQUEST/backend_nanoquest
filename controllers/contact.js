import contacts from '../models/contactus.js';
import { configureMail } from './mailConfig.js';

export const contactus = async (req, res) => {
    const {name, email, phoneNumber } = req.body;
    try {
        await contacts.create({name, email, phoneNumber });
        return res.status(201).json({ success: true, message: "We will reach you soon..!" });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Contact not reached. Try Again" });
    }
};

export const sendEmail = async (req, res) => {
    const {name, email, phoneNumber } = req.body;

    // Compose the email message
    const message = `New contact details:\nName:${name}\nEmail: ${email}\nPhone Number: ${phoneNumber}`;

    try {
        // Configure mail transporter
        const transporter = await configureMail();

        // Send email to support@nanoquesttech.in
        await transporter.sendMail({
            from: email,
            to: 'nanoquest43@gmail.com',
            subject: 'New Contact Details',
            text: message,
        });

        return res.status(200).json({ success: true, message: 'Contact details sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ success: false, message: 'Failed to send contact details' });
    }
};
