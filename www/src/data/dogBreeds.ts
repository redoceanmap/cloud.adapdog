/** 자주 등록하는 견종 선택지 — 직접 입력도 가능 */
export const DOG_BREED_OPTIONS = [
  '골든 리트리버',
  '래브라도 리트리버',
  '말티즈',
  '푸들',
  '웰시 코기',
  '시츄',
  '비숑 프리제',
  '포메라니안',
  '치와와',
  '닥스훈트',
  '보더 콜리',
  '시바견',
  '진돗개',
  '슈나우저',
  '요크셔 테리어',
  '믹스견',
] as const;

export type DogBreedOption = (typeof DOG_BREED_OPTIONS)[number];
