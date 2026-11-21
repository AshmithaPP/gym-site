import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, need, plan, session, message } = body || {};

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and phone number are required." },
        { status: 400 }
      );
    }

    const targetEmail = process.env.GMAIL_USER || "legionfitnessofficial@gmail.com";
    const appPassword = process.env.GMAIL_APP_PASSWORD;

    const goal = plan || need || "General Enquiry";
    const sessionTime = session || "Flexible";
    const notes = message || "None provided";
    const now = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    // If GMAIL_APP_PASSWORD is not yet configured, log the lead and return simulated success
    if (!appPassword) {
      console.warn(
        `[Enquiry] GMAIL_APP_PASSWORD is not set in .env.local.\nLead captured:\n- Name: ${name}\n- Email: ${email}\n- Phone: ${phone}\n- Goal: ${goal}`
      );
      return NextResponse.json({
        success: true,
        simulated: true,
        message: "Enquiry logged successfully. Note: Configure GMAIL_APP_PASSWORD in .env.local to activate live email delivery.",
      });
    }

    // Configure Nodemailer with Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: targetEmail,
        pass: appPassword,
      },
    });

    // 1. Email to the Gym (Legion Fitness)
    const gymMail = {
      from: `"Legion Website" <${targetEmail}>`,
      to: targetEmail,
      replyTo: email,
      subject: `New Lead: ${name} (${goal})`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0b0c; color: #e4e4e7; padding: 32px 16px; min-height: 100%;">
          <div style="max-width: 580px; margin: 0 auto; background-color: #141415; border: 1px solid #2b2b2e; border-radius: 16px; overflow: hidden;">
            <div style="background: linear-gradient(180deg, #1e1e20 0%, #141415 100%); padding: 24px; border-bottom: 1px solid #2b2b2e; text-align: center;">
              <h1 style="margin: 0; font-size: 20px; letter-spacing: 3px; text-transform: uppercase; color: #f5f5f6;">LEGION FITNESS</h1>
              <p style="margin: 6px 0 0; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #8b8b90;">New Website Enquiry</p>
            </div>
            
            <div style="padding: 24px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; color: #8b8b90; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; width: 130px;">Name</td>
                  <td style="padding: 10px 0; color: #ffffff; font-size: 15px; font-weight: 600;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #8b8b90; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Phone</td>
                  <td style="padding: 10px 0; color: #ffffff; font-size: 15px; font-weight: 600;">
                    <a href="tel:${phone.replace(/\s/g, "")}" style="color: #e4e4e7; text-decoration: underline;">${phone}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #8b8b90; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Email</td>
                  <td style="padding: 10px 0; color: #ffffff; font-size: 15px;">
                    <a href="mailto:${email}" style="color: #e4e4e7; text-decoration: underline;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #8b8b90; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Training Need</td>
                  <td style="padding: 10px 0; color: #ffffff; font-size: 15px; font-weight: 600;">${goal}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #8b8b90; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Preferred Session</td>
                  <td style="padding: 10px 0; color: #ffffff; font-size: 15px;">${sessionTime}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #8b8b90; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; vertical-align: top;">Notes / Message</td>
                  <td style="padding: 10px 0; color: #bfbfc3; font-size: 14px; line-height: 1.5;">${notes}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #8b8b90; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Submitted At</td>
                  <td style="padding: 10px 0; color: #8b8b90; font-size: 13px;">${now}</td>
                </tr>
              </table>
            </div>

            <div style="background-color: #0b0b0c; padding: 16px 24px; border-top: 1px solid #2b2b2e; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #8b8b90;">Hit "Reply" in your email client to respond directly to ${name}.</p>
            </div>
          </div>
        </div>
      `,
    };

    // 2. Email to the Visitor (Auto-Reply Confirmation)
    const userMail = {
      from: `"Legion Fitness" <${targetEmail}>`,
      to: email,
      subject: `We've received your enquiry — Legion Fitness`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0b0c; color: #e4e4e7; padding: 32px 16px; min-height: 100%;">
          <div style="max-width: 580px; margin: 0 auto; background-color: #141415; border: 1px solid #2b2b2e; border-radius: 16px; overflow: hidden;">
            <div style="background: linear-gradient(180deg, #1e1e20 0%, #141415 100%); padding: 32px 24px; border-bottom: 1px solid #2b2b2e; text-align: center;">
              <h1 style="margin: 0; font-size: 22px; letter-spacing: 3px; text-transform: uppercase; color: #f5f5f6;">LEGION FITNESS</h1>
              <p style="margin: 6px 0 0; font-size: 11px; letter-spacing: 2.5px; text-transform: uppercase; color: #bfbfc3;">Where Warriors Are Made</p>
            </div>
            
            <div style="padding: 32px 24px;">
              <h2 style="margin: 0 0 16px; font-size: 18px; color: #f5f5f6; font-weight: 600;">Hi ${name},</h2>
              <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.6; color: #bfbfc3;">
                Thank you for reaching out to Legion Fitness! We have successfully received your enquiry regarding <strong>${goal}</strong>.
              </p>
              
              <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6; color: #bfbfc3;">
                Our certified coaching team is reviewing your requirements and will get in touch with you shortly on <strong>${phone}</strong> to help schedule your consultation or answer any questions you have.
              </p>

              <div style="background-color: #0b0b0c; border: 1px solid #2b2b2e; border-radius: 12px; padding: 20px; margin: 24px 0;">
                <p style="margin: 0 0 8px; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; color: #8b8b90; font-weight: bold;">Gym Details</p>
                <p style="margin: 0 0 6px; font-size: 13px; color: #e4e4e7; line-height: 1.4;">
                  <strong>Address:</strong> No.10, Annapoorni Nagar Main Rd, VGP SANTHOSHAM, Madhavaram, Chennai, Tamil Nadu 600110
                </p>
                <p style="margin: 0 0 6px; font-size: 13px; color: #e4e4e7;">
                  <strong>Phone:</strong> +91 86083 42599 / +91 866 729 7036
                </p>
                <p style="margin: 8px 0 0; font-size: 13px;">
                  <a href="https://share.google/81bSnJApi1b1dnzbd" target="_blank" style="color: #f5f5f6; text-decoration: underline;">Open location on Google Maps ↗</a>
                </p>
              </div>

              <p style="margin: 0; font-size: 14px; color: #8b8b90; line-height: 1.5;">
                We look forward to welcoming you to the Legion.
              </p>
            </div>

            <div style="background-color: #0b0b0c; padding: 18px 24px; border-top: 1px solid #2b2b2e; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #8b8b90;">© ${new Date().getFullYear()} Legion Fitness. All rights reserved.</p>
            </div>
          </div>
        </div>
      `,
    };

    // Dispatch both emails in parallel
    await Promise.all([
      transporter.sendMail(gymMail),
      transporter.sendMail(userMail),
    ]);

    return NextResponse.json({
      success: true,
      message: "Enquiry submitted and emails dispatched successfully.",
    });
  } catch (error) {
    console.error("[Enquiry API Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send email. Please try again or contact us directly." },
      { status: 500 }
    );
  }
}
