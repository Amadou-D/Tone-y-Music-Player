Louie-Phase 6
Security Recommendation: Implement Android Network Security Configuration
a.	What is your security recommendation? Why did you choose it?

The Recommendation is to enhance the network communication’s security within our music player app. Since our app allows streaming of music from remote servers and handles user account, it is important to ensure that there are security measures put in place to protect user data and establish trust.

b.	Who dies the recommendation benefit?
This recommendation benefits the end users as it guarantees privacy and protection to their personal data. This will also benefit us, the developers as it helps establish trust with end users.

c.	If the recommendation was found somewhere other than the provided checklist, include a link to it. 
This recommendation is provided from the supplied Android App Security Checklist (https://github.com/muellerberndt/android_app_security_checklist).
d.	When would the recommendation have to be implemented (based on how serious the security risk is)?
Implementation of this recommendation should be implemented During the early stage of development or when the authentication API is being implemented in the project code. This will allow secure network communications if users are sharing personal information with the application.
e.	Why do you think your project needs your recommendation?

Our application although a small project that handles simple authentication, like any other music streaming apps, can potentially have in-app purchase features for streaming music that requires licensing. If this app was to continue in that direction in the future, it will need to handle credit card information which are sensitive and needs extra protection. Without network security implemented, these sensitive data are prone to be stolen or manipulated.

f.	How do you think your recommendation could be applied?
From the provided GitHub link above, Android provides built-in support and comprehensive documentation for security configurations making implementations feasible and easy to do. Because of this built-ion nature, app performance is not affected greatly and documentation for bugs are easily troubleshooted. Testing is essential to ensure that the security configurations do not interfere with the app’s functionalities and should be done in different network environments and android versions. The repository recommendation follows: 
-	Certificate Pinning. 
This is important as it safeguards from cyber attacks when streaming music or handling payments and ensures that the app only communicates with the trusted server. To implement this, a pin-set is used when establishing connection to remote endpoints by creating a certified chain that is valid. Maintenance is also essential to ensure that the pin-sets and trust anchors are kept up to date.
-	Disabling Cleartext Traffic.
Cleartext or unencrypted traffic is vulnerable to attacks and should always be encrypted to protect user data. This is implemented in the network_security_config.xml where the cleartextTrafficPermitted is set to ‘false’:

<base-config cleartextTrafficPermitted="false">
    <trust-anchors>
        <certificates src="system" />
    </trust-anchors>
</base-config>
