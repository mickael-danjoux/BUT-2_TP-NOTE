// @ts-check
import eslint from '@eslint/js'
import eslintPluginNode from 'eslint-plugin-node'
import eslintPluginImport from 'eslint-plugin-import'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import globals from 'globals'

export default [
  eslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      node: eslintPluginNode,
      import: eslintPluginImport,
      prettier: eslintPluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error', // Force le formatage selon les règles de Prettier
      'no-console': 'off', // Autorise l'utilisation de console.log
      'no-unused-vars': ['error', { argsIgnorePattern: 'next' }], // Autorise les variables non utilisées nommées "next" (middleware Express)
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }], // Autorise l'importation de dépendances de développement
      'no-underscore-dangle': 'off', // Autorise les variables avec un underscore (_) au début
      'func-names': 'off', // Autorise les fonctions anonymes
      'consistent-return': 'off', // Autorise les retours inconsistants dans les fonctions
      'no-process-exit': 'off', // Autorise l’utilisation de process.exit()
      semi: ['error', 'never'], // Interdit l’utilisation de points-virgules
      'node/exports-style': ['error', 'module.exports'], // Force l’utilisation du style module.exports pour les exports
      'node/file-extension-in-import': ['error', 'always'], // Force l’inclusion des extensions de fichier dans les imports
      'node/prefer-global/buffer': ['error', 'always'], // Préfère l’utilisation de Buffer global plutôt que require('buffer')
      'node/prefer-global/console': ['error', 'always'], // Préfère l’utilisation de console globale plutôt que require('console')
      'node/prefer-global/process': ['error', 'always'], // Préfère l’utilisation de process global plutôt que require('process')
      'node/prefer-global/url-search-params': ['error', 'always'], // Préfère l’utilisation de URLSearchParams global
      'node/prefer-global/url': ['error', 'always'], // Préfère l’utilisation de URL global plutôt que require('url')
      'node/prefer-promises/dns': 'error', // Force l’utilisation de la version Promises des méthodes DNS
      'node/prefer-promises/fs': 'error', // Force l’utilisation de la version Promises des méthodes FS
      'import/first': 'error', // Force tous les imports à être au début du fichier
      'import/newline-after-import': 'error', // Force une ligne vide après les imports
      'import/no-duplicates': 'error', // Interdit les imports en double
    },
    files: ['**/*.js'],
    ignores: ['node_modules/**', 'dist/**', 'build/**'],
  },
]
