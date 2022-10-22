import { describe, it, expect } from 'vitest';

import { mount } from '@vue/test-utils';
import LoginButton from '../LoginButton.vue';

describe('LoginButton', () => {
	it('renders properly', () => {
		const wrapper = mount(LoginButton);
		expect(wrapper.text()).toContain('Authorize with Bungie.net');
	});
});
