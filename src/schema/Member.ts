import { Namespace } from '../Namespace';
import { MemberToken } from '../parser/Token';

import { ComplexType } from './ComplexType';

/** SimpleType equivalent JavaScript data types. */

export type SimpleValue = string | number | boolean;

/** Configuration for elements and attributes as type members. */

export class MemberSpec {

	constructor(
		public min = 1,
		public max = 1
	) {}

	meta?: MemberMeta;

}

/** Definition of a type with only text content.
  * Applicable to both elements and attributes. */

export class SimpleType {

	base?: SimpleType;

}

export class MemberMeta {

	/** @param token Token with element or attribute name and namespace.
	  * A single token may have different types depending on its parent. */
	constructor(public token: MemberToken) {}

	exists = true;

	type: SimpleType | ComplexType;

}
