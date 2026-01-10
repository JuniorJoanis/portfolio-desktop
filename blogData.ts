export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  featured?: boolean;
  content: string;
  resources?: { title: string; url: string }[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'building-flexible-sso-authentication-system',
    title: 'Building a Flexible SSO Authentication System: OAuth2 & SAML2 in Rails',
    excerpt: 'How we built a multi-tenant SSO system supporting both OAuth2 and SAML2 protocols, enabling seamless integration with enterprise identity providers like Azure AD, Okta, and OneLogin.',
    date: 'January 2026',
    readTime: '15 min read',
    tags: ['Ruby on Rails', 'OAuth2', 'SAML2', 'Authentication', 'Enterprise', 'Security'],
    featured: true,
    resources: [
      { title: 'OAuth 2.0 RFC 6749', url: 'https://tools.ietf.org/html/rfc6749' },
      { title: 'PKCE RFC 7636', url: 'https://tools.ietf.org/html/rfc7636' },
      { title: 'SAML 2.0 Specification', url: 'http://docs.oasis-open.org/security/saml/v2.0/' },
      { title: 'OpenID Connect', url: 'https://openid.net/connect/' },
    ],
    content: `
<h2>Introduction</h2>

<p>Single Sign-On (SSO) has become an essential feature for enterprise applications. It allows employees to access multiple services using a single set of credentials, improving security and user experience while reducing password fatigue.</p>

<p>In this post, we'll walk through how we built a flexible, multi-tenant SSO system that supports both OAuth2 and SAML2 protocols, allowing each company to configure their preferred identity provider.</p>

<h2>The Challenge</h2>

<p>Our platform serves multiple companies, each with different identity management requirements:</p>

<ul>
  <li>Some companies use <strong>Microsoft Azure AD</strong> (OAuth2)</li>
  <li>Others use <strong>Okta</strong> or <strong>OneLogin</strong> (SAML2)</li>
  <li>Many require <strong>PKCE</strong> (Proof Key for Code Exchange) for enhanced security</li>
  <li>Mobile and web applications need different redirect URIs</li>
  <li>Each company may have multiple SSO configurations for different environments</li>
</ul>

<p>We needed a solution that could handle all these scenarios while remaining maintainable and secure.</p>

<h2>Architecture Overview</h2>

<p>At the heart of our implementation is the <code>SsoInformation</code> model, which stores all configuration details for each SSO integration:</p>

<pre><code>+------------------+          +-------------------+
|     Company      |  1----*  |  SsoInformation   |
+------------------+          +-------------------+
| - name           |          | - kind (oauth2/saml2)
| - code           |          | - oauth2_issuer
| - enabled        |          | - oauth2_client_id
+------------------+          | - saml_idp_metadata
                              | - enabled
                              | - environment
                              +-------------------+
                                       |
                                       | 1
                                       |
                                       * 
                                +-------------+
                                |    User     |
                                +-------------+</code></pre>

<h2>Key Design Decisions</h2>

<h3>1. Protocol Flexibility</h3>

<p>We support two main protocols through a <code>kind</code> attribute:</p>

<ul>
  <li><strong>oauth2</strong>: For OpenID Connect providers (Azure AD, Google, etc.)</li>
  <li><strong>saml2</strong>: For SAML 2.0 providers (Okta, OneLogin, ADFS, etc.)</li>
</ul>

<p>This allows companies to use whichever protocol their IdP supports best.</p>

<h3>2. Multi-Environment Support</h3>

<p>Each SSO configuration has an environment setting:</p>

<ul>
  <li>production</li>
  <li>staging</li>
  <li>development</li>
  <li>test</li>
</ul>

<p>This enables companies to test SSO integrations before going live.</p>

<h3>3. Security Layers</h3>

<p>We implemented optional security enhancements:</p>

<ul>
  <li><strong>PKCE Layer</strong>: Prevents authorization code interception attacks</li>
  <li><strong>State Parameter</strong>: Prevents CSRF attacks during OAuth flow</li>
  <li><strong>Response Mode</strong>: Configurable token delivery method</li>
</ul>

<h3>4. Platform-Specific Redirects</h3>

<p>Separate redirect URLs for web and mobile applications ensure deep linking works correctly across platforms:</p>

<pre><code>oauth2_web_redirect_url: https://app.example.com/oauth/callback
oauth2_mobile_redirect_url: myapp://oauth/callback</code></pre>

<h2>OAuth2 Implementation</h2>

<p>For OAuth2, we support two grant flows:</p>

<h3>1. Authorization Code Flow (Recommended)</h3>

<p>The most secure option for server-side applications:</p>

<pre><code>User -> App -> IdP (authorize) -> App (with code) -> IdP (token) -> App</code></pre>

<p>With PKCE enabled, an additional <code>code_verifier</code>/<code>code_challenge</code> pair is generated to prevent code interception:</p>

<pre><code class="language-ruby">def self.generate_pkce
  pkce_challenge = PkceChallenge.challenge(char_length: 58)
  {
    code_verifier: pkce_challenge.code_verifier, 
    code_challenge: pkce_challenge.code_challenge
  }
end</code></pre>

<h3>2. Implicit Grant Flow (Legacy)</h3>

<p>Used for legacy single-page applications where tokens are returned directly in the URL fragment. Less secure, but sometimes required for compatibility.</p>

<h2>SAML2 Implementation</h2>

<p>For SAML2, we store the IdP configuration including:</p>

<ul>
  <li><code>saml_idp_metadata</code>: Full XML metadata from the identity provider</li>
  <li><code>saml_idp_entity_id</code>: Unique identifier for the IdP</li>
  <li><code>saml_sso_url</code>: Where to send authentication requests</li>
  <li><code>saml_certificate</code>: Public certificate for signature verification</li>
  <li><code>saml_consumer_service_url</code>: Where the IdP sends responses (ACS URL)</li>
  <li><code>saml_name_identifier_format</code>: How user identifiers are formatted</li>
</ul>

<p>The SAML flow initiates through a dedicated endpoint:</p>

<pre><code>/api/v3/saml/init?company_code=ACME&sso_uuid=abc-123</code></pre>

<h2>User Attribute Mapping</h2>

<p>Different IdPs return user data in different formats. We handle this through configurable attribute keys:</p>

<ul>
  <li><code>oauth2_email_key</code>: Where to find the email (e.g., "email", "mail", "upn")</li>
  <li><code>oauth2_firstname_key</code>: First name location (e.g., "given_name", "firstName")</li>
  <li><code>oauth2_last_name_key</code>: Last name location (e.g., "family_name", "lastName")</li>
  <li><code>oauth2_user_division_key</code>: Optional organizational unit mapping</li>
</ul>

<p>This flexibility means we can integrate with any IdP without code changes.</p>

<h2>Domain-Based SSO Discovery</h2>

<p>To simplify the login experience, we support domain-based SSO discovery through the <code>sign_in_domains</code> array:</p>

<pre><code class="language-ruby">sso_config.sign_in_domains = ["acme.com", "acme.co.uk"]</code></pre>

<p>When a user enters their email, we can automatically detect if SSO is available and redirect them to the appropriate identity provider.</p>

<h2>Security Considerations</h2>

<h3>1. Secret Management</h3>

<p>Sensitive values like <code>client_secret</code> are encrypted at rest using our application-level encryptor:</p>

<pre><code class="language-ruby">def encrypted_oauth2_client_secret
  Base64.urlsafe_encode64($encryptor.encrypt(oauth2_client_secret))
end</code></pre>

<h3>2. UUID-Based Identification</h3>

<p>Each SSO configuration has a unique UUID, preventing enumeration attacks and allowing safe public references in URLs.</p>

<h3>3. Certificate Fingerprint Validation</h3>

<p>For SAML, we validate certificate fingerprints to prevent man-in-the-middle attacks during assertion verification.</p>

<h3>4. Scope Validation</h3>

<p>OAuth2 scopes are validated and sanitized to prevent injection:</p>

<pre><code class="language-ruby">def oauth2_scopes=(arr)
  self[:oauth2_scopes] = arr&.reject(&:empty?)
end</code></pre>

<h2>Example Configuration</h2>

<p>Here's how to set up a demo OAuth2 SSO configuration:</p>

<pre><code class="language-ruby">SsoInformation.create!(
  company: company,
  enabled: true,
  kind: 'oauth2',
  flow: 'authorization_code',
  token_key: 'access_token',
  environment: :development,
  sso_provider: 'azure_ad',
  oauth2_issuer: 'https://login.microsoftonline.com/tenant-id/v2.0',
  oauth2_client_id: 'your-client-id',
  oauth2_client_secret: 'your-client-secret',
  oauth2_web_redirect_url: 'https://app.joanis.co/oauth/callback',
  oauth2_mobile_redirect_url: 'joanis://oauth/callback',
  oauth2_authorize_url: '/oauth2/v2.0/authorize',
  oauth2_token_url: '/oauth2/v2.0/token',
  oauth2_scopes: ['openid', 'email', 'profile'],
  oauth2_email_key: 'email',
  pkce_layer: true,
  state_parameter: true
)</code></pre>

<h2>Lessons Learned</h2>

<h3>1. Flexibility is Key</h3>
<p>Enterprise IdPs vary wildly in their implementations. Building in configurability from the start saved countless hours of custom development.</p>

<h3>2. Test Environments Matter</h3>
<p>The environment enum prevented many production incidents by allowing companies to fully test their SSO setup before enabling it for all users.</p>

<h3>3. Mobile is Different</h3>
<p>Deep linking and custom URL schemes require separate handling from web redirects. Plan for this from the beginning.</p>

<h3>4. Documentation is Essential</h3>
<p>SSO setup is complex. We created detailed guides for each major IdP (Azure AD, Okta, Google Workspace) to help companies self-service.</p>

<h3>5. Graceful Degradation</h3>
<p>Always have a fallback authentication method. If SSO fails, users should still be able to access their accounts through email/password.</p>

<h2>Conclusion</h2>

<p>Building a flexible SSO system requires careful planning and an understanding of both OAuth2 and SAML2 protocols. By creating a configurable, multi-tenant architecture, we've enabled seamless integration with virtually any enterprise identity provider.</p>

<p>The key takeaways:</p>

<ul>
  <li>Support multiple protocols (OAuth2 and SAML2)</li>
  <li>Make everything configurable (attribute mapping, URLs, security options)</li>
  <li>Plan for different environments (production, staging, development)</li>
  <li>Consider both web and mobile platforms</li>
  <li>Prioritize security (PKCE, state validation, encryption)</li>
</ul>

<p>This approach has allowed us to onboard enterprise customers quickly while maintaining the security standards they require.</p>
    `.trim(),
  },
];

