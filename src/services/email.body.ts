export class EmailBody {
  static verifyEmail() {
    // Generate a 6-digit verification code
    const date = new Date();
    const verificationCode =
      `${date.getFullYear()}${date.getMonth()}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}${date.getMilliseconds()}`.substr(
        0,
        6
      );

    // Create a professional welcome message with inline CSS
    const text = `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <h2 style="color: #4A90E2; font-size: 24px;">Welcome to Tybo Editor!</h2>
          <p style="font-size: 16px; color: #555;">
            Thank you for signing up! We're excited to have you on board.
          </p>
          <p style="font-size: 16px; color: #555;">
            Please use the following verification code to complete your registration:
          </p>
          <div style="
            margin-top: 20px;
            padding: 10px 15px;
            background-color: #f4f4f4;
            border: 1px solid #ddd;
            display: inline-block;
            font-size: 18px;
            font-weight: bold;
            color: #333;
          ">
            ${verificationCode}
          </div>
          <p style="font-size: 14px; color: #999; margin-top: 20px;">
            If you did not sign up for Tybo, please ignore this email.
          </p>
      
        </div>
      `;

    return { text, verificationCode };
  }
  static welcomeEmail(name: string) {
    return `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color: #4A90E2; font-size: 24px;">Welcome to Tybo Editor!</h2>
        <p style="font-size: 16px; color: #555;">
          We're thrilled to have you on board! You're now part of a growing community of creators building amazing websites with ease.
        </p>
        <p style="font-size: 16px; color: #555;">
          With Tybo Editor, you can create stunning, responsive websites in minutes-without writing a single line of code.
        </p>
        
        <!-- Useful Information Section -->
        <h3 style="color: #4A90E2; font-size: 20px; margin-top: 30px;">Get Started</h3>
        <p style="font-size: 16px; color: #555;">
          Here's how to get started quickly:
        </p>
        <ul style="font-size: 16px; color: #555; line-height: 1.6;">
          <li>Watch our <a href="https://tybo.co.za/tutorials" style="color: #4A90E2; text-decoration: none;">Getting Started Video</a></li>
          <li>Explore the <a href="https://tybo.co.za/templates" style="color: #4A90E2; text-decoration: none;">Template Library</a> to find the perfect design for your website.</li>
          <li>Read our <a href="https://tybo.co.za/docs" style="color: #4A90E2; text-decoration: none;">Documentation</a> for step-by-step guides.</li>
        </ul>
        
        <!-- Customer Support Section -->
        <h3 style="color: #4A90E2; font-size: 20px; margin-top: 30px;">Need Help?</h3>
        <p style="font-size: 16px; color: #555;">
          Our support team is here for you! If you have any questions or run into any issues, feel free to reach out:
        </p>
        <ul style="font-size: 16px; color: #555; line-height: 1.6;">
          <li>Email us at <a href="mailto:support@tybo.co.za" style="color: #4A90E2; text-decoration: none;">support@tybo.co.za</a></li>
          <li>Visit our <a href="https://tybo.co.za/help" style="color: #4A90E2; text-decoration: none;">Help Center</a> for FAQs and tutorials.</li>
        </ul>
        
        <p style="font-size: 16px; color: #555; margin-top: 30px;">
          We're excited to see what you create. Happy editing!
        </p>
        <p style="font-size: 16px; color: #555;">
          Best regards, <br>
          The Tybo Editor Team
        </p>
      </div>
    `;
  }
  
}
