import React from "react";

const TermsModal: React.FC<ITermsModal> = ({ isOpen, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 text-black">
            <div className="bg-white rounded-lg shadow-lg p-4 max-w-3xl w-full h-auto overflow-auto max-h-[90vh]">
                <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Terms of Service for Stock Trading Platform</h1>
                    <p className=" mb-6">Last updated: 02.10.2024</p>
                    <p className=" mb-4">Please read these terms and conditions carefully before using our service.</p>

                    <h2 className="text-2xl font-semibold text-blue-600 mt-6 mb-2">Interpretation and Definitions</h2>
                    <h3 className="text-xl font-semibold text-gray-700 mt-4">Interpretation</h3>
                    <p className=" mb-4">The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>

                    <h3 className="text-xl font-semibold text-gray-700 mt-4">Definitions</h3>
                    <p className=" mb-4">For the purposes of these Terms of Service:</p>
                    <ul className="list-disc list-inside mb-6">
                        <li><strong>“Affiliate”</strong> means an entity that controls, is controlled by, or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest, or other securities entitled to vote for the election of directors or other managing authority.</li>
                        <li><strong>“Account”</strong> means a unique account created for You to access our Service or parts of our Service.</li>
                        <li><strong>“Company”</strong> refers to Hotello, located at Potsdam, Germany.</li>
                        <li><strong>“Country”</strong> refers to Germany.</li>
                        <li><strong>“Content”</strong> refers to content such as text, images, or other information that can be posted, uploaded, linked to, or otherwise made available by You, regardless of the form of that content.</li>
                        <li><strong>“Device”</strong> means any device that can access the Service such as a computer, a cell phone, or a digital tablet.</li>
                        <li><strong>“Feedback”</strong> means feedback, innovations, or suggestions sent by You regarding the attributes, performance, or features of our Service.</li>
                        <li><strong>“Service”</strong> refers to the website and services offered by Hotello, which includes stock trading, portfolio management, and related functionalities.</li>
                        <li><strong>“Terms of Service”</strong> mean these Terms of Service that form the entire agreement between You and the Company regarding the use of the Service.</li>
                        <li><strong>“Third-party Social Media Service”</strong> means any services or content provided by a third-party that may be displayed, included, or made available by the Service.</li>
                        <li><strong>“Website”</strong> refers to Hotello's online platform, accessible from https://github.com/karamanburak.</li>
                        <li><strong>“You”</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-blue-600 mt-6 mb-2">Acknowledgment</h2>
                    <p className=" mb-4">These are the Terms of Service governing the use of this Service and the agreement that operates between You and the Company. These Terms of Service set out the rights and obligations of all users regarding the use of the Service.</p>
                    <p className=" mb-4">Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms of Service. These Terms of Service apply to all visitors, users, and others who access or use the Service.</p>

                    <h2 className="text-2xl font-semibold text-blue-600 mt-6 mb-2">Eligibility and Account Creation</h2>
                    <p className=" mb-4">To participate in stock trading on our platform, You must be at least 18 years old and legally capable of entering into binding contracts. You must provide accurate information when creating an Account and keep it updated.</p>

                    <h2 className="text-2xl font-semibold text-blue-600 mt-6 mb-2">Use of Service</h2>
                    <p className=" mb-4">By accessing or using the Service, you represent and warrant that you are of legal age to form a binding contract with the Company and that you have the full right, authority, and capacity to enter into and abide by these Terms of Service.</p>
                    <p className=" mb-4">You may use the Service only for lawful purposes and in accordance with the rules governing securities and trading in your country of residence. The Service allows you to buy, sell, and hold stocks and other financial instruments subject to applicable laws.</p>

                    <h2 className="text-2xl font-semibold text-blue-600 mt-6 mb-2">Risk Acknowledgment</h2>
                    <p className=" mb-4">Stock trading and investment involve significant risks, including the potential loss of your invested capital. By using this Service, you acknowledge and accept these risks. The Company does not guarantee any profits from the use of the Service.</p>

                    <h2 className="text-2xl font-semibold text-blue-600 mt-6 mb-2">Termination and Suspension</h2>
                    <p className=" mb-4">We may terminate or suspend your Account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms, engage in illegal activities, or violate securities regulations.</p>

                    <h2 className="text-2xl font-semibold text-blue-600 mt-6 mb-2">Limitation of Liability</h2>
                    <p className=" mb-4">In no event shall the Company, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:</p>
                    <ul className="list-disc list-inside mb-6">
                        <li>Your access to or use of, or inability to access or use the Service;</li>
                        <li>Any conduct or content of any third party on the Service;</li>
                        <li>Any content obtained from the Service;</li>
                        <li>Unauthorized access, use, or alteration of your transmissions or content.</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-blue-600 mt-6 mb-2">Governing Law</h2>
                    <p className=" mb-4">These Terms shall be governed by and construed in accordance with the laws of Germany, without regard to its conflict of law provisions.</p>

                    <h2 className="text-2xl font-semibold text-blue-600 mt-6 mb-2">Changes to These Terms</h2>
                    <p className="text-gray-600 mb-4">We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>

                    <h2 className="text-2xl font-semibold text-blue-600 mt-6 mb-2">Contact Us</h2>
                    <p className=" mb-4">If you have any questions about these Terms, please contact us:</p>
                    <ul className="list-disc list-inside mb-6">
                        <li>By email: <a href="mailto:karaman.buraak@gmail.com" className="text-blue-600 underline">karaman.buraak@gmail.com</a></li>
                        <li>By visiting this page on our website: <a href="http://www.karamanburak.com" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">www.karamanburak.com</a></li>
                        <li>By phone number: +49 157 530 30761</li>
                    </ul>
                    <div>{children}</div>
                </div>
            </div>
        </div>
    );
};

export default TermsModal;
