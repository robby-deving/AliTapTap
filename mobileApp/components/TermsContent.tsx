import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const TermsContent = () => {
  console.log('TermsContent is rendering');
  return (
    <View style={styles.container}>
      {/* Section 1 */}
      <View>
        <Text style={styles.sectionTitleLarge}>1. Acceptance of Terms</Text>
        <Text style={styles.paragraph}>
          By downloading, accessing, or using AliTapTap, you agree to these Terms and Conditions, as well as our Privacy Policy. These terms may be updated from time to time, and we will notify you of changes through the app. Continued use of the app after updates means you accept the new terms.
        </Text>
      </View>

      {/* Section 2 */}
      <View>
        <Text style={styles.sectionTitle}>2. Eligibility</Text>
        <Text style={styles.paragraph}>
          To use AliTapTap, you must be at least 18 years old and capable of entering into a legal agreement. By using the app, you confirm that you meet these requirements. Users under 18 are not allowed to create accounts or place orders.
        </Text>
      </View>

      {/* Section 3 */}
      <View>
        <Text style={styles.sectionTitle}>3. Account Registration</Text>
        <View style={styles.bulletContainer}>
          <Text style={styles.bulletPoint}>
            • You must create an account to use AliTapTap. Provide accurate details (e.g., name, email, and password) during sign-up.
          </Text>
          <Text style={styles.bulletPoint}>
            • You are responsible for keeping your account secure. Do not share your password with others.
          </Text>
          <Text style={styles.bulletPoint}>
            • If you suspect someone else is using your account, inform us immediately via the app’s chat feature.
          </Text>
          <Text style={styles.bulletPointWithMargin}>
            • We may suspend or delete your account if you provide false information or violate these terms.
          </Text>
        </View>
      </View>

      {/* Section 4 */}
      <View>
        <Text style={styles.sectionTitle}>4. Use of the App</Text>
        <Text style={styles.paragraph}>
          AliTapTap allows you to:
        </Text>
        <View style={styles.bulletContainer}>
          <Text style={styles.bulletPoint}>
            • Browse and select NFC business card designs.
          </Text>
          <Text style={styles.bulletPoint}>
            • Customize cards with your personal or business information (e.g., name, contact details, logo).
          </Text>
          <Text style={styles.bulletPoint}>
            • Place orders, make payments, and track deliveries.
          </Text>
        </View>
        <Text style={[styles.paragraph, styles.marginTop]}>
          You agree to:
        </Text>
        <View style={styles.bulletContainer}>
          <Text style={styles.bulletPoint}>
            • Use the app only for lawful purposes.
          </Text>
          <Text style={styles.bulletPoint}>
            • Not misuse the app (e.g., hacking, spamming, or uploading harmful content).
          </Text>
          <Text style={styles.bulletPointWithMargin}>
            • Respect the rights of other users and the AliTapTap team.
          </Text>
        </View>
      </View>

      {/* Section 5 */}
      <View>
        <Text style={styles.sectionTitle}>5. Ordering and Customization</Text>
        <View style={styles.bulletContainer}>
          <Text style={styles.bulletPoint}>
            • You can choose from available designs or upload your own. Customization options are limited to text, images, and materials (PVC, Metal, Wood).
          </Text>
          <Text style={styles.bulletPoint}>
            • Once an order is finalized and submitted, it cannot be changed or canceled because the cards are custom-made.
          </Text>
          <Text style={styles.bulletPoint}>
            • Prices depend on the material and quantity you select. The app will show the total cost before checkout.
          </Text>
          <Text style={styles.bulletPointWithMargin}>
            • All orders are final once payment is confirmed.
          </Text>
        </View>
      </View>

      {/* Section 6 */}
      <View>
        <Text style={styles.sectionTitle}>6. Payment</Text>
        <View style={styles.bulletContainer}>
          <Text style={styles.bulletPoint}>
            • Payments are processed securely through the PayMongo API. Accepted methods include GCash, GrabPay, and debit/credit cards.
          </Text>
          <Text style={styles.bulletPoint}>
            • Cash on Delivery (COD) is not available to prevent fraud and losses from unclaimed orders.
          </Text>
          <Text style={styles.bulletPoint}>
            • You must provide accurate payment details. We are not responsible for errors caused by incorrect information.
          </Text>
          <Text style={styles.bulletPointWithMargin}>
            • All transactions are in Philippine Pesos (PHP).
          </Text>
        </View>
      </View>

      {/* Section 7 */}
      <View>
        <Text style={styles.sectionTitle}>7. Shipping and Delivery</Text>
        <View style={styles.bulletContainer}>
          <Text style={styles.bulletPoint}>
            • You must provide a valid shipping address during checkout. We are not responsible for delays or losses due to incorrect addresses.
          </Text>
          <Text style={styles.bulletPoint}>
            • Order tracking is available in the app. Delivery times are estimates and may vary due to shipping issues beyond our control.
          </Text>
          <Text style={styles.bulletPointWithMargin}>
            • Once an order is marked "Delivered," it is your responsibility to claim it.
          </Text>
        </View>
      </View>

      {/* Section 8 */}
      <View>
        <Text style={styles.sectionTitle}>8. Returns and Refunds</Text>
        <View style={styles.bulletContainer}>
          <Text style={styles.bulletPoint}>
            • Since NFC business cards are customized, we do not accept returns or issue refunds unless the product is defective or damaged upon arrival.
          </Text>
          <Text style={styles.bulletPoint}>
            • To request a refund, contact us via the app’s chat feature within 7 days of delivery. Provide proof (e.g., photos of the defect).
          </Text>
          <Text style={styles.bulletPointWithMargin}>
            • If approved, refunds will be processed within 14 days using your original payment method.
          </Text>
        </View>
      </View>

      {/* Section 9 */}
      <View>
        <Text style={styles.sectionTitle}>9. Reviews and Ratings</Text>
        <View style={styles.bulletContainer}>
          <Text style={styles.bulletPoint}>
            • You may leave reviews and ratings for products you purchase. Reviews must be honest and respectful.
          </Text>
          <Text style={styles.bulletPoint}>
            • We may remove reviews that are offensive, false, or violate these terms.
          </Text>
          <Text style={styles.bulletPointWithMargin}>
            • Your feedback helps us improve but does not obligate us to act on it.
          </Text>
        </View>
      </View>

      {/* Section 10 */}
      <View>
        <Text style={styles.sectionTitle}>10. Intellectual Property</Text>
        <View style={styles.bulletContainer}>
          <Text style={styles.bulletPoint}>
            • All app content (e.g., designs, logos, text) belongs to AliTapTap or its creators unless you upload your own design.
          </Text>
          <Text style={styles.bulletPoint}>
            • You may not copy, sell, or use our content without permission.
          </Text>
          <Text style={styles.bulletPointWithMargin}>
            • Designs you upload must be yours or ones you have the right to use. You are responsible for any copyright issues.
          </Text>
        </View>
      </View>

      {/* Section 11 */}
      <View>
        <Text style={styles.sectionTitle}>11. Privacy</Text>
        <View style={styles.bulletContainer}>
          <Text style={styles.bulletPoint}>
            • We collect and use your data (e.g., name, address, payment details) to process orders and improve the app. See our Privacy Policy for details.
          </Text>
          <Text style={styles.bulletPointWithMargin}>
            • We will not share your information with others except as needed for shipping or payment processing.
          </Text>
        </View>
      </View>

      {/* Section 12 */}
      <View>
        <Text style={styles.sectionTitle}>12. Limitation of Liability</Text>
        <View style={styles.bulletContainer}>
          <Text style={styles.bulletPoint}>
            • AliTapTap is provided "as is." We do our best to ensure it works well, but we are not responsible for technical issues (e.g., app crashes, internet problems).
          </Text>
          <Text style={styles.bulletPoint}>
            • We are not liable for losses caused by your misuse of the app or events beyond our control (e.g., natural disasters).
          </Text>
          <Text style={styles.bulletPointWithMargin}>
            Our liability is limited to the amount you paid for your order.
          </Text>
        </View>
      </View>

      {/* Section 13 */}
      <View>
        <Text style={styles.sectionTitle}>13. Termination</Text>
        <View style={styles.bulletContainer}>
          <Text style={styles.bulletPoint}>
            • You may stop using AliTapTap anytime by deleting your account.
          </Text>
          <Text style={styles.bulletPoint}>
            • We may suspend or terminate your account if you break these terms or misuse the app.
          </Text>
          <Text style={styles.bulletPointWithMargin}>
            • Upon termination, you lose access to your account and orders.
          </Text>
        </View>
      </View>

      {/* Section 14 */}
      <View>
        <Text style={styles.sectionTitle}>14. Governing Law</Text>
        <Text style={styles.paragraph}>
          These Terms and Conditions follow the laws of the Republic of the Philippines. Any disputes will be resolved in courts located in Legazpi City, Albay.
        </Text>
      </View>

      {/* Section 15 */}
      <View>
        <Text style={styles.sectionTitle}>15. Contact Us</Text>
        <Text style={styles.paragraph}>
          For questions, complaints, or support, use the app’s chat feature or email us at [insert contact email]. We will respond as soon as possible.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    
    gap: 16 // space-y-4
  },
  sectionTitleLarge: {
    fontSize: 20, // text-xl
    fontWeight: '700', // font-bold
    marginBottom: 8 // mb-2
  },
  sectionTitle: {
    fontSize: 18, // text-lg
    fontWeight: '600', // font-semibold
    marginBottom: 8 // mb-2
  },
  paragraph: {
    fontSize: 16, // text-base
    textAlign: 'justify', // text-justify
    lineHeight: 24, // leading-6
    marginBottom: 16 // mb-4
  },
  bulletPoint: {
    fontSize: 16,
    textAlign: 'justify',
    lineHeight: 24,
    paddingLeft: 16, // pl-4
  },
  bulletPointWithMargin: {
    fontSize: 16,
    textAlign: 'justify',
    lineHeight: 24,
    paddingLeft: 16,
    marginBottom: 16 // mb-4
  },
  bulletContainer: {
    gap: 8 // space-y-2
  },
  marginTop: {
    marginTop: 8 // mt-2
  },
  marginBottom: {
    marginBottom: 8 // mb-2
  }
});

export default TermsContent;