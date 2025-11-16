import nextConfig from 'eslint-config-next/core-web-vitals';

const rulesToDisable = {
  'react-hooks/set-state-in-effect': 'off',
  'react/no-unescaped-entities': 'off',
};

const updatedConfig = nextConfig.map((configItem) => {
  if (configItem && typeof configItem === 'object' && configItem.rules) {
    return {
      ...configItem,
      rules: {
        ...configItem.rules,
        ...rulesToDisable,
      },
    };
  }
  return configItem;
});

export default updatedConfig;
