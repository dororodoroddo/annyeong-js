import AnnyeongComponent from '../../../component/AnnyeongComponent';

const CommonButton = () => {
  return new AnnyeongComponent<HTMLButtonElement> ({
    htmlType: 'button',
    state: {
      test: 123,
    },
    appendChilds() {
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