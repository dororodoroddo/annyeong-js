import AnnyeongComponent from '../../../component/AnneongComponent';
import CommonButton from './CommonButton';

const CommonComponent = () => {




  return new AnnyeongComponent<HTMLDivElement>({
    htmlType: 'div',
    state: {
      test: 123,
    },
    renderFuntion() {
      return [
        CommonButton()
      ];
    },
  });
};

export default CommonComponent;