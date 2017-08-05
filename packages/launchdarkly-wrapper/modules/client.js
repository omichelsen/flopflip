import ldClient from 'ldclient-js';
import camelCase from 'lodash.camelcase';
import uuid from './uuid';

const createAnonymousUser = () => ({
  key: uuid(),
});

const normalizeFlag = (flagName, flagValue) => [
  camelCase(flagName),
  // Multivariate flags contain a string or `null` - `false` seems
  // more natural.
  flagValue === null ? false : flagValue,
];

const camelCaseFlags = rawFlags =>
  Object.entries(rawFlags).reduce((camelCasedFlags, [flagName, flagValue]) => {
    const [normalzedFlagName, normalzedFlagValue] = normalizeFlag(
      flagName,
      flagValue
    );
    // Can't return expression as it is the assigned value
    camelCasedFlags[normalzedFlagName] = normalzedFlagValue;

    return camelCasedFlags;
  }, {});

const flagUpdates = ({ rawFlags, client, onUpdateFlags }) => {
  // Dispatch whenever configured flag value changes
  for (const flagName in rawFlags) {
    if (Object.prototype.hasOwnProperty.call(rawFlags, flagName)) {
      client.on(`change:${flagName}`, flagValue => {
        const [normalzedFlagName, normalzedFlagValue] = normalizeFlag(
          flagName,
          flagValue
        );

        onUpdateFlags({
          [normalzedFlagName]: normalzedFlagValue,
        });
      });
    }
  }
};

export const initialize = ({ clientSideId, user }) =>
  ldClient.initialize(clientSideId, user || createAnonymousUser());

export const listen = ({ client, onUpdateFlags, onUpdateStatus }) => {
  client.on('ready', () => {
    onUpdateStatus({ isReady: true });

    const rawFlags = client.allFlags();
    const camelCasedFlags = camelCaseFlags(rawFlags);

    onUpdateFlags(camelCasedFlags);

    flagUpdates({ rawFlags, client, onUpdateFlags });
  });
};
