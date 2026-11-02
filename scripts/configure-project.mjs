import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getSecurityRules } from 'firebase-admin/security-rules';
import { readFile } from 'node:fs/promises';
const projectId = process.argv[2];
if (!projectId) throw new Error('Usage: node scripts/configure-project.mjs PROJECT_ID');
const app = initializeApp({ projectId, credential: applicationDefault() });
const auth = getAuth(app);
await auth.projectConfigManager().updateProjectConfig({
    multiFactorConfig: {
        state: 'ENABLED',
        providerConfigs: [{ state: 'ENABLED', totpProviderConfig: { adjacentIntervals: 1 } }],
    },
    emailPrivacyConfig: { enableImprovedEmailPrivacy: true },
});
const source = await readFile(new URL('../firestore.rules', import.meta.url), 'utf8');
await getSecurityRules(app).releaseFirestoreRulesetFromSource(source);
const config = await auth.projectConfigManager().getProjectConfig();
const rules = await getSecurityRules(app).getFirestoreRuleset();
if (!config.multiFactorConfig?.providerConfigs?.some(p => p.state === 'ENABLED' && p.totpProviderConfig))
    throw new Error('TOTP configuration was not verified');
if (!rules.source.some(file => file.content === source)) throw new Error('Released rules differ from repository');
console.log('Verified: TOTP enabled, email enumeration protection enabled, repository Firestore rules deployed.');
