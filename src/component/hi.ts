import { Attribute } from '../types';

/**
 * 간단한 HTMLElement 즉시 생성 함수
 * @param type 생성할 html 타입
 * @param attributes html 어트리뷰트
 * @returns HTMLElement
 * 어트리뷰트는 함수, 스트링일 경우도 있지만 style처럼 쪼개져서 들어가기도 하여 object일 경우 다시 쪼개져 들어간다.
 * (첫 글자가 소문자인 이유는 심플하기 위해서이다.)
 */
export default function hi<HTMLType extends HTMLElement>(
  type: string,
  attributes: Attribute<HTMLType> = {}
) {
  const el = document.createElement(type) as HTMLType;
  for (const attributeKey in attributes) {
    const attribute = attributes[attributeKey];
    if (attribute) {
      if (typeof attribute === 'object') {
        for (const subAttributeKey in attribute) {
          const subAttribute = attribute[subAttributeKey];
          if (subAttribute) {
            el[attributeKey][subAttributeKey] = subAttribute;
          }
        }
      } else {
        el[attributeKey] = attribute;
      }
    }
  }
  return el;
}
