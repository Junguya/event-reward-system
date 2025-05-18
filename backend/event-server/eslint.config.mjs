import eslint from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    // 이 파일 자체는 ESLint가 검사하지 않도록
    ignores: ['eslint.config.mjs'],

    // 사용할 플러그인 등록
    plugins: {
      import: importPlugin,
    },

    // 전역 변수, 소스타입, parserOptions 등
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // ESLint 기본 권장 설정
  eslint.configs.recommended,

  // TS-ESLint 권장 + 타입체크 설정
  ...tseslint.configs.recommendedTypeChecked,

  // Prettier 연동
  eslintPluginPrettierRecommended,

  // 추가 커스텀 룰
  {
    rules: {
      // 트레일링 스페이스 비활성화
      'no-trailing-spaces': 'off',

      // TypeScript 관련 룰
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',

      // import 순서 정렬
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
          ],
          alphabetize: { order: 'asc', caseInsensitive: true },
          'newlines-between': 'always',
        },
      ],
    },
  },
);
