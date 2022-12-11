import AnnyeongComponent from '../../../component/AnnyeongComponent';
import CommonButton from './CommonButton';

const CommonComponent = () => {
  return new AnnyeongComponent<HTMLDivElement>({
    htmlType: 'div',
    state: {
      test: 123,
    },
    appendChilds() {
      return [
        CommonButton()
      ];
    },
  });
};

export default CommonComponent;