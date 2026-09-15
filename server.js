const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());





// Email API
app.post("/api/enquiry", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      message,
      SMTP_USER,
      SMTP_PASS,
      toEmail,
    } = req.body;

    // Validation
    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, phone and message are required",
      });
    }

    const mailOptions = {
      from: SMTP_USER,
      to: toEmail,

      // When you click Reply in Gmail,
      // reply will go to the customer
      replyTo: email,

      subject: `Quick Lead Enquiry from ${name}`,

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 650px;
          margin: auto;
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
        ">

          <div style="
            background: #1d4ed8;
            color: white;
            padding: 20px;
          ">
            <h2 style="margin: 0;">
              Quick Lead Enquiry
            </h2>
          </div>

          <div style="padding: 25px;">

            <p>
              A new enquiry has been submitted on your website.
            </p>

            <hr />

            <h3 style="color:#1d4ed8;">Customer Details</h3>

            <p>
              <strong>Name:</strong><br>
              ${name}
            </p>

            <p>
              <strong>Email:</strong><br>
              ${email}
            </p>

            <p>
              <strong>Phone:</strong><br>
              ${phone}
            </p>

            <p>
              <strong>Company:</strong><br>
              ${company || "Not provided"}
            </p>

            <p>
              <strong>Message:</strong><br>
              ${message}
            </p>

          </div>

        </div>
      `,
    };

    // Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent:", info.messageId);

    res.status(200).json({
      success: true,
      message: "Enquiry sent successfully",
    });

  } catch (error) {
    console.error("Email sending error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send enquiry",
    });
  }
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Email API is running",
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});