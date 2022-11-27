import AnnyeongComponent from '../../../component/AnneongComponent';

const CommonButton = () => {


  return new AnnyeongComponent<HTMLButtonElement>({
    htmlType: 'button',
    state: {
      test: 123,
    },
    renderFuntion() {
      return [

      ];
    },
    attributes: {
      type: 'button',
      onclick() {
        console.log(1);
      },
    },
  });
};

export default CommonButton;