import React from 'react';
import { Text, View } from 'react-native';

const TermsContent = () => {
  console.log('TermsContent is rendering');
  return (
    <View className="space-y-4">
      {/* Section 1 */}
      <View>
        <Text className="text-xl font-bold mb-2">1. Acceptance of Terms</Text>
        <Text className="text-base text-justify leading-6 mb-4">
          By downloading, accessing, or using AliTapTap, you agree to these Terms and Conditions, as well as our Privacy Policy. These terms may be updated from time to time, and we will notify you of changes through the app. Continued use of the app after updates means you accept the new terms.
        </Text>
      </View>

      {/* Section 2 */}
      <View>
        <Text className="text-xl font-semibold mb-2">2. Eligibility</Text>
        <Text className="text-base text-justify leading-6 mb-4">
          To use AliTapTap, you must be at least 18 years old and capable of entering into a legal agreement. By using the app, you confirm that you meet these requirements. Users under 18 are not allowed to create accounts or place orders.
        </Text>
      </View>

      {/* Section 3 */}
      <View>
        <Text className="text-lg font-semibold mb-2">3. Account Registration</Text>
        <View className="space-y-2">
          <Text className="text-base text-justify leading-6 pl-4">
            • You must create an account to use AliTapTap. Provide accurate details (e.g., name, email, and password) during sign-up.
          </Text>
          <Text className="text-base text-justify leading-6 pl-4">
            • You are responsible for keeping your account secure. Do not share your password with others.
          </Text>
          <Text className="text-base text-justify leading-6 pl-4">
            • If you suspect someone else is using your account, inform us immediately via the app’s chat feature.
          </Text>
          <Text className="text-base text-justify leading-6 pl-4 mb-4">
            • We may suspend or delete your account if you provide false information or violate these terms.
          </Text>
        </View>
      </View>

      {/* Section 4 */}
      <View>
        <Text className="text-lg font-semibold mb-2">4. Use of the App</Text>
        <Text className="text-base text-justify leading-6 mb-2">
          AliTapTap allows you to:
        </Text>
        <View className="space-y-2">
          <Text className="text-base text-justify leading-6 pl-4">
            • Browse and select NFC business card designs.
          </Text>
          <Text className="text-base text-justify leading-6 pl-4">
            • Customize cards with your personal or business information (e.g., name, contact details, logo).
          </Text>
          <Text className="text-base text-justify leading-6 pl-4">
            • Place orders, make payments, and track deliveries.
          </Text>
        </View>
        <Text className="text-base text-justify leading-6 mt-2 mb-2">
          You agree to:
        </Text>
        <View className="space-y-2">
          <Text className="text-base text-justify leading-6 pl-4">
            • Use the app only for lawful purposes.
          </Text>
          <Text className="text-base text-justify leading-6 pl-4">
            • Not misuse the app (e.g., hacking, spamming, or uploading harmful content).
          </Text>
          <Text className="text-base text-justify leading-6 pl-4 mb-4">
            • Respect the rights of other users and the AliTapTap team.
          </Text>
        </View>
      </View>

      {/* Section 5 */}
      <View>
        <Text className="text-lg font-semibold mb-2">5. Ordering and Customization</Text>
        <View className="space-y-2">
          <Text className="text-base text-justify leading-6">
            • You can choose from available designs or upload your own. Customization options are limited to text, images, and materials (PVC, Metal, Wood).
          </Text>
          <Text className="text-base text-justify leading-6">
            • Once an order is finalized and submitted, it cannot be changed or canceled because the cards are custom-made.
          </Text>
          <Text className="text-base text-justify leading-6">
            • Prices depend on the material and quantity you select. The app will show the total cost before checkout.
          </Text>
          <Text className="text-base text-justify leading-6 mb-4">
            • All orders are final once payment is confirmed.
          </Text>
        </View>
      </View>

      {/* Section 6 */}
      <View>
        <Text className="text-lg font-semibold mb-2">6. Payment</Text>
        <View className="space-y-2">
          <Text className="text-base text-justify leading-6">
            • Payments are processed securely through the PayMongo API. Accepted methods include GCash, GrabPay, and debit/credit cards.
          </Text>
          <Text className="text-base text-justify leading-6">
            • Cash on Delivery (COD) is not available to prevent fraud and losses from unclaimed orders.
          </Text>
          <Text className="text-base text-justify leading-6">
            • You must provide accurate payment details. We are not responsible for errors caused by incorrect information.
          </Text>
          <Text className="text-base text-justify leading-6 mb-4">
            • All transactions are in Philippine Pesos (PHP).
          </Text>
        </View>
      </View>

      {/* Section 7 */}
      <View>
        <Text className="text-lg font-semibold mb-2">7. Shipping and Delivery</Text>
        <View className="space-y-2">
          <Text className="text-base text-justify leading-6">
            • You must provide a valid shipping address during checkout. We are not responsible for delays or losses due to incorrect addresses.
          </Text>
          <Text className="text-base text-justify leading-6">
            • Order tracking is available in the app. Delivery times are estimates and may vary due to shipping issues beyond our control.
          </Text>
          <Text className="text-base text-justify leading-6 mb-4">
            • Once an order is marked "Delivered," it is your responsibility to claim it.
          </Text>
        </View>
      </View>

      {/* Section 8 */}
      <View>
        <Text className="text-lg font-semibold mb-2">8. Returns and Refunds</Text>
        <View className="space-y-2">
          <Text className="text-base text-justify leading-6">
            • Since NFC business cards are customized, we do not accept returns or issue refunds unless the product is defective or damaged upon arrival.
          </Text>
          <Text className="text-base text-justify leading-6">
            • To request a refund, contact us via the app’s chat feature within 7 days of delivery. Provide proof (e.g., photos of the defect).
          </Text>
          <Text className="text-base text-justify leading-6 mb-4">
            • If approved, refunds will be processed within 14 days using your original payment method.
          </Text>
        </View>
      </View>

      {/* Section 9 */}
      <View>
        <Text className="text-lg font-semibold mb-2">9. Reviews and Ratings</Text>
        <View className="space-y-2">
          <Text className="text-base text-justify leading-6">
            • You may leave reviews and ratings for products you purchase. Reviews must be honest and respectful.
          </Text>
          <Text className="text-base text-justify leading-6">
            • We may remove reviews that are offensive, false, or violate these terms.
          </Text>
          <Text className="text-base text-justify leading-6 mb-4">
            • Your feedback helps us improve but does not obligate us to act on it.
          </Text>
        </View>
      </View>

      {/* Section 10 */}
      <View>
        <Text className="text-lg font-semibold mb-2">10. Intellectual Property</Text>
        <View className="space-y-2">
          <Text className="text-base text-justify leading-6">
            • All app content (e.g., designs, logos, text) belongs to AliTapTap or its creators unless you upload your own design.
          </Text>
          <Text className="text-base text-justify leading-6">
            • You may not copy, sell, or use our content without permission.
          </Text>
          <Text className="text-base text-justify leading-6 mb-4">
            • Designs you upload must be yours or ones you have the right to use. You are responsible for any copyright issues.
          </Text>
        </View>
      </View>

      {/* Section 11 */}
      <View>
        <Text className="text-lg font-semibold mb-2">11. Privacy</Text>
        <View className="space-y-2">
          <Text className="text-base text-justify leading-6">
            • We collect and use your data (e.g., name, address, payment details) to process orders and improve the app. See our Privacy Policy for details.
          </Text>
          <Text className="text-base text-justify leading-6 mb-4">
            • We will not share your information with others except as needed for shipping or payment processing.
          </Text>
        </View>
      </View>

      {/* Section 12 */}
      <View>
        <Text className="text-lg font-semibold mb-2">12. Limitation of Liability</Text>
        <View className="space-y-2">
          <Text className="text-base text-justify leading-6">
            • AliTapTap is provided "as is." We do our best to ensure it works well, but we are not responsible for technical issues (e.g., app crashes, internet problems).
          </Text>
          <Text className="text-base text-justify leading-6">
            • We are not liable for losses caused by your misuse of the app or events beyond our control (e.g., natural disasters).
          </Text>
          <Text className="text-base text-justify leading-6 mb-4">
            Our liability is limited to the amount you paid for your order.
          </Text>
        </View>
      </View>

      {/* Section 13 */}
      <View>
        <Text className="text-lg font-semibold mb-2">13. Termination</Text>
        <View className="space-y-2">
          <Text className="text-base text-justify leading-6">
            • You may stop using AliTapTap anytime by deleting your account.
          </Text>
          <Text className="text-base text-justify leading-6">
            • We may suspend or terminate your account if you break these terms or misuse the app.
          </Text>
          <Text className="text-base text-justify leading-6 mb-4">
            • Upon termination, you lose access to your account and orders.
          </Text>
        </View>
      </View>

      {/* Section 14 */}
      <View>
        <Text className="text-lg font-semibold mb-2">14. Governing Law</Text>
        <Text className="text-base text-justify leading-6 mb-4">
          These Terms and Conditions follow the laws of the Republic of the Philippines. Any disputes will be resolved in courts located in Legazpi City, Albay.
        </Text>
      </View>

      {/* Section 15 */}
      <View>
        <Text className="text-lg font-semibold mb-2">15. Contact Us</Text>
        <Text className="text-base text-justify leading-6 mb-4">
          For questions, complaints, or support, use the app’s chat feature or email us at [insert contact email]. We will respond as soon as possible.
        </Text>
      </View>
    </View>
  );
};

export default TermsContent;