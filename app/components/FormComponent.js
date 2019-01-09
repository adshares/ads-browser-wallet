import PageComponent from './PageComponent';

export default class FormComponent extends PageComponent {

  handleInputChange = (event, callback) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    }, callback);
  };

  handlePasswordChange = (event) => {
    this.handleInputChange(event, () => {
      document.querySelector('[name=password]').setCustomValidity('');
    });
  };
}
