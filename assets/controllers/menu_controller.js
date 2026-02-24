import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    static targets = ['nav'];

    toggle() {
        this.navTarget.classList.toggle('hidden');
    }
}
