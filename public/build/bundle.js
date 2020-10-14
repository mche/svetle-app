
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
(function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.24.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/components/Clock.svelte generated by Svelte v3.24.0 */

    const file = "src/components/Clock.svelte";

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (8:4) {#each [1, 2, 3, 4] as offset}
    function create_each_block_1(ctx) {
    	let circle;
    	let circle_class_value;
    	let circle_r_value;
    	let circle_cy_value;
    	let circle_cx_value;

    	const block = {
    		c: function create() {
    			circle = svg_element("circle");

    			attr_dev(circle, "class", circle_class_value = "minor " + (/*minute*/ ctx[7] + /*offset*/ ctx[10] == /*seconds*/ ctx[2]
    			? "minor-second-on"
    			: "") + " svelte-ybfex5");

    			attr_dev(circle, "r", circle_r_value = /*minute*/ ctx[7] + /*offset*/ ctx[10] == /*seconds*/ ctx[2]
    			? 2
    			: 1);

    			attr_dev(circle, "cy", circle_cy_value = Math.sin(/*ItemRadian*/ ctx[5](/*minute*/ ctx[7] + /*offset*/ ctx[10] - 15)) * (/*r*/ ctx[4] - 0.22 * /*r*/ ctx[4]));
    			attr_dev(circle, "cx", circle_cx_value = Math.cos(/*ItemRadian*/ ctx[5](/*minute*/ ctx[7] + /*offset*/ ctx[10] - 15)) * (/*r*/ ctx[4] - 0.22 * /*r*/ ctx[4]));
    			add_location(circle, file, 8, 6, 534);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, circle, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*seconds*/ 4 && circle_class_value !== (circle_class_value = "minor " + (/*minute*/ ctx[7] + /*offset*/ ctx[10] == /*seconds*/ ctx[2]
    			? "minor-second-on"
    			: "") + " svelte-ybfex5")) {
    				attr_dev(circle, "class", circle_class_value);
    			}

    			if (dirty & /*seconds*/ 4 && circle_r_value !== (circle_r_value = /*minute*/ ctx[7] + /*offset*/ ctx[10] == /*seconds*/ ctx[2]
    			? 2
    			: 1)) {
    				attr_dev(circle, "r", circle_r_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(circle);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(8:4) {#each [1, 2, 3, 4] as offset}",
    		ctx
    	});

    	return block;
    }

    // (6:2) {#each [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55] as minute}
    function create_each_block(ctx) {
    	let line;
    	let line_class_value;
    	let line_y__value;
    	let line_y__value_1;
    	let line_transform_value;
    	let each_1_anchor;
    	let each_value_1 = [1, 2, 3, 4];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < 4; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			line = svg_element("line");

    			for (let i = 0; i < 4; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();

    			attr_dev(line, "class", line_class_value = "major " + (/*minute*/ ctx[7] % 15 ? "" : "major2") + " " + (/*minute*/ ctx[7] == /*seconds*/ ctx[2]
    			? "major-second-on"
    			: "") + " svelte-ybfex5");

    			attr_dev(line, "y1", line_y__value = "-" + (0.7 + (/*minute*/ ctx[7] % 15 ? 0 : -0.1)) * /*r*/ ctx[4]);
    			attr_dev(line, "y2", line_y__value_1 = "-" + 0.8 * /*r*/ ctx[4]);
    			attr_dev(line, "transform", line_transform_value = "rotate(" + 6 * /*minute*/ ctx[7] + ")");
    			add_location(line, file, 6, 4, 305);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, line, anchor);

    			for (let i = 0; i < 4; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*seconds*/ 4 && line_class_value !== (line_class_value = "major " + (/*minute*/ ctx[7] % 15 ? "" : "major2") + " " + (/*minute*/ ctx[7] == /*seconds*/ ctx[2]
    			? "major-second-on"
    			: "") + " svelte-ybfex5")) {
    				attr_dev(line, "class", line_class_value);
    			}

    			if (dirty & /*seconds, Math, ItemRadian, r*/ 52) {
    				each_value_1 = [1, 2, 3, 4];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < 4; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < 4; i += 1) {
    					each_blocks[i].d(1);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(line);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(6:2) {#each [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55] as minute}",
    		ctx
    	});

    	return block;
    }

    // (29:4) {#if !(seconds%2) }
    function create_if_block(ctx) {
    	let text_1;
    	let t;
    	let text_1_y_value;

    	const block = {
    		c: function create() {
    			text_1 = svg_element("text");
    			t = text(":");
    			attr_dev(text_1, "x", "-1");
    			attr_dev(text_1, "y", text_1_y_value = 0.5 * /*r*/ ctx[4]);
    			attr_dev(text_1, "class", "digits tick svelte-ybfex5");
    			add_location(text_1, file, 28, 23, 1531);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, text_1, anchor);
    			append_dev(text_1, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(text_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(29:4) {#if !(seconds%2) }",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let svg;
    	let circle0;
    	let circle0_r_value;
    	let g0;
    	let line0;
    	let line0_y__value;
    	let circle1;
    	let g0_transform_value;
    	let line1;
    	let line1_y__value;
    	let line1_transform_value;
    	let g1;
    	let line2;
    	let line2_y__value;
    	let line2_y__value_1;
    	let line3;
    	let line3_y__value;
    	let g1_transform_value;
    	let text0;

    	let t0_value = (/*hours*/ ctx[0].toString().length === 1
    	? "0" + /*hours*/ ctx[0].toString()
    	: /*hours*/ ctx[0]) + "";

    	let t0;
    	let text0_x_value;
    	let text0_y_value;
    	let text1;

    	let t1_value = (/*minutes*/ ctx[1].toString().length === 1
    	? "0" + /*minutes*/ ctx[1].toString()
    	: /*minutes*/ ctx[1]) + "";

    	let t1;
    	let text1_y_value;
    	let svg_viewBox_value;
    	let each_value = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < 12; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	let if_block = !(/*seconds*/ ctx[2] % 2) && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			circle0 = svg_element("circle");

    			for (let i = 0; i < 12; i += 1) {
    				each_blocks[i].c();
    			}

    			g0 = svg_element("g");
    			line0 = svg_element("line");
    			circle1 = svg_element("circle");
    			line1 = svg_element("line");
    			g1 = svg_element("g");
    			line2 = svg_element("line");
    			line3 = svg_element("line");
    			text0 = svg_element("text");
    			t0 = text(t0_value);
    			if (if_block) if_block.c();
    			text1 = svg_element("text");
    			t1 = text(t1_value);
    			attr_dev(circle0, "class", "clock-face svelte-ybfex5");
    			attr_dev(circle0, "r", circle0_r_value = /*r*/ ctx[4] - 2);
    			add_location(circle0, file, 2, 2, 154);
    			attr_dev(line0, "y1", "2");
    			attr_dev(line0, "y2", line0_y__value = -0.4 * /*r*/ ctx[4]);
    			add_location(line0, file, 15, 4, 992);
    			attr_dev(circle1, "r", "7");
    			attr_dev(circle1, "cy", "-25");
    			attr_dev(circle1, "class", "svelte-ybfex5");
    			add_location(circle1, file, 16, 4, 1022);
    			attr_dev(g0, "class", "hour svelte-ybfex5");
    			attr_dev(g0, "transform", g0_transform_value = "rotate(" + (30 * /*hours*/ ctx[0] + /*minutes*/ ctx[1] / 2) + ")");
    			add_location(g0, file, 14, 2, 921);
    			attr_dev(line1, "class", "minute svelte-ybfex5");
    			attr_dev(line1, "y1", "4");
    			attr_dev(line1, "y2", line1_y__value = -0.6 * /*r*/ ctx[4]);
    			attr_dev(line1, "transform", line1_transform_value = "rotate(" + (6 * /*minutes*/ ctx[1] + /*seconds*/ ctx[2] / 10) + ")");
    			add_location(line1, file, 20, 2, 1089);
    			attr_dev(line2, "class", "second svelte-ybfex5");
    			attr_dev(line2, "y1", line2_y__value = 0.2 * /*r*/ ctx[4]);
    			attr_dev(line2, "y2", line2_y__value_1 = -0.76 * /*r*/ ctx[4]);
    			add_location(line2, file, 24, 4, 1276);
    			attr_dev(line3, "class", "second-counterweight svelte-ybfex5");
    			attr_dev(line3, "y1", line3_y__value = 0.2 * /*r*/ ctx[4]);
    			attr_dev(line3, "y2", "2");
    			add_location(line3, file, 25, 4, 1328);
    			attr_dev(g1, "transform", g1_transform_value = "rotate(" + 6 * (/*seconds*/ ctx[2] + /*milliseconds*/ ctx[3] / 1000) + ")");
    			add_location(g1, file, 23, 2, 1212);
    			attr_dev(text0, "x", text0_x_value = -0.2 * /*r*/ ctx[4]);
    			attr_dev(text0, "y", text0_y_value = 0.5 * /*r*/ ctx[4]);
    			attr_dev(text0, "class", "digits svelte-ybfex5");
    			add_location(text0, file, 27, 4, 1394);
    			attr_dev(text1, "x", "4");
    			attr_dev(text1, "y", text1_y_value = 0.5 * /*r*/ ctx[4]);
    			attr_dev(text1, "class", "digits svelte-ybfex5");
    			add_location(text1, file, 29, 4, 1590);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "viewBox", svg_viewBox_value = "-" + /*r*/ ctx[4] + " -" + /*r*/ ctx[4] + " " + 2 * /*r*/ ctx[4] + " " + 2 * /*r*/ ctx[4]);
    			attr_dev(svg, "class", "z-depth-3 green lighten-4 svelte-ybfex5");
    			add_location(svg, file, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, circle0);

    			for (let i = 0; i < 12; i += 1) {
    				each_blocks[i].m(svg, null);
    			}

    			append_dev(svg, g0);
    			append_dev(g0, line0);
    			append_dev(g0, circle1);
    			append_dev(svg, line1);
    			append_dev(svg, g1);
    			append_dev(g1, line2);
    			append_dev(g1, line3);
    			append_dev(svg, text0);
    			append_dev(text0, t0);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, text1);
    			append_dev(text1, t1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*seconds, Math, ItemRadian, r*/ 52) {
    				each_value = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < 12; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(svg, g0);
    					}
    				}

    				for (; i < 12; i += 1) {
    					each_blocks[i].d(1);
    				}
    			}

    			if (dirty & /*hours, minutes*/ 3 && g0_transform_value !== (g0_transform_value = "rotate(" + (30 * /*hours*/ ctx[0] + /*minutes*/ ctx[1] / 2) + ")")) {
    				attr_dev(g0, "transform", g0_transform_value);
    			}

    			if (dirty & /*minutes, seconds*/ 6 && line1_transform_value !== (line1_transform_value = "rotate(" + (6 * /*minutes*/ ctx[1] + /*seconds*/ ctx[2] / 10) + ")")) {
    				attr_dev(line1, "transform", line1_transform_value);
    			}

    			if (dirty & /*seconds, milliseconds*/ 12 && g1_transform_value !== (g1_transform_value = "rotate(" + 6 * (/*seconds*/ ctx[2] + /*milliseconds*/ ctx[3] / 1000) + ")")) {
    				attr_dev(g1, "transform", g1_transform_value);
    			}

    			if (dirty & /*hours*/ 1 && t0_value !== (t0_value = (/*hours*/ ctx[0].toString().length === 1
    			? "0" + /*hours*/ ctx[0].toString()
    			: /*hours*/ ctx[0]) + "")) set_data_dev(t0, t0_value);

    			if (!(/*seconds*/ ctx[2] % 2)) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(svg, text1);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*minutes*/ 2 && t1_value !== (t1_value = (/*minutes*/ ctx[1].toString().length === 1
    			? "0" + /*minutes*/ ctx[1].toString()
    			: /*minutes*/ ctx[1]) + "")) set_data_dev(t1, t1_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			destroy_each(each_blocks, detaching);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let time = new Date();
    	let r = 100; /// радиус циферблата 

    	//~   $: classMinuteOn = Array(60).fill('').map((minute, idx) => {return idx == seconds ? 'major-second-on' : ''; });///console.log('$classMinuteOn', seconds)
    	const ItemRadian = item => 2 * Math.PI / 60 * item; /// перевод 60 позиций в радианы безотносительно начала отсчета

    	setInterval(
    		() => {
    			$$invalidate(6, time = new Date());
    		},
    		100
    	);

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Clock> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Clock", $$slots, []);

    	$$self.$capture_state = () => ({
    		time,
    		r,
    		ItemRadian,
    		hours,
    		minutes,
    		seconds,
    		milliseconds
    	});

    	$$self.$inject_state = $$props => {
    		if ("time" in $$props) $$invalidate(6, time = $$props.time);
    		if ("r" in $$props) $$invalidate(4, r = $$props.r);
    		if ("hours" in $$props) $$invalidate(0, hours = $$props.hours);
    		if ("minutes" in $$props) $$invalidate(1, minutes = $$props.minutes);
    		if ("seconds" in $$props) $$invalidate(2, seconds = $$props.seconds);
    		if ("milliseconds" in $$props) $$invalidate(3, milliseconds = $$props.milliseconds);
    	};

    	let hours;
    	let minutes;
    	let seconds;
    	let milliseconds;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*time*/ 64) {
    			// эти переменные автоматически обновляются, каждый раз
    			// когда изменяется `time`, блягодаря префиксу `$:`
    			 $$invalidate(0, hours = time.getHours());
    		}

    		if ($$self.$$.dirty & /*time*/ 64) {
    			 $$invalidate(1, minutes = time.getMinutes());
    		}

    		if ($$self.$$.dirty & /*time*/ 64) {
    			 $$invalidate(2, seconds = time.getSeconds());
    		}

    		if ($$self.$$.dirty & /*time*/ 64) {
    			 $$invalidate(3, milliseconds = time.getMilliseconds());
    		}
    	};

    	return [hours, minutes, seconds, milliseconds, r, ItemRadian];
    }

    class Clock extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Clock",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    /* src/components/Me.svelte generated by Svelte v3.24.0 */

    const file$1 = "src/components/Me.svelte";

    function create_fragment$1(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let path2;
    	let path3;
    	let path4;
    	let path5;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			path3 = svg_element("path");
    			path4 = svg_element("path");
    			path5 = svg_element("path");
    			attr_dev(path0, "d", "M283.313,152H288v16h16V152h16V136H280a8,8,0,0,0-5.657,2.343l-8,8,11.313,11.313Z");
    			add_location(path0, file$1, 1, 2, 87);
    			attr_dev(path1, "d", "M511.313,474.949l-56-126.194A8,8,0,0,0,448,344H320V280.251l15.619-13.388h0A23.971,23.971,0,0,0,344,248.641v-28.36l20.438-13.625A8,8,0,0,0,368,200V144a7.965,7.965,0,0,0-7.309-7.956l6.286-75.425a24.125,24.125,0,0,0-15.3-24.393L265.181,2.96a24.129,24.129,0,0,0-18.672.609L158.9,44a24.046,24.046,0,0,0-13.844,23.964l6.189,68.081A7.965,7.965,0,0,0,144,144v48a8,8,0,0,0,2.343,5.657L168,219.313v29.328a23.973,23.973,0,0,0,8.381,18.222L192,280.251V344H64a8,8,0,0,0-7.25,4.617l-56,120A8.005,8.005,0,0,0,0,472v40H16V473.775L69.095,360h67.343a458.971,458.971,0,0,1-.421,48.485C134.71,428.73,132,446.157,128,460.349V416H112v96h16V498.691C154.566,462.222,153.633,385.837,152.473,360H176v32c0,.223.011.444.029.664h0l0,.03v.008c.28,3.345,6.12,70.63,23.969,97.814V512h16V488a8,8,0,0,0-1.6-4.8c-9.315-12.42-15.62-41.751-19.194-65.257l22.648,27.178a8,8,0,0,0,14.037-3.806c.012-.071.027-.153.04-.225l.069.208V512h16V448h16v64h16V441.3l.069-.207c.012.072.028.154.04.225a8,8,0,0,0,14.037,3.806L316.8,417.937c-3.571,23.5-9.875,52.829-19.2,65.263A8,8,0,0,0,296,488v24h16V490.517c17.849-27.184,23.689-94.469,23.969-97.814v-.008l0-.03h0c.018-.22.029-.442.029-.664V360h15.538a471.48,471.48,0,0,0,.479,49.515c2.647,41.028,10.715,71,23.983,89.175V512h16V416H376v44.347c-3.984-14.146-6.693-31.506-8-51.666A459.433,459.433,0,0,1,367.563,360H442.8L496,479.89V512h16V478.194A8.007,8.007,0,0,0,511.313,474.949ZM248,280v16H237.918a8,8,0,0,1-5.206-1.926L200,266.035V208H184V77c8.909-1.718,33.51-3.63,72-3.63s63.091,1.912,72,3.63V208H312v58.035l-32.713,28.04A8.006,8.006,0,0,1,274.081,296H264V280Zm104-84.281-8,5.333V157.766l8-2.667ZM165.6,58.532,253.213,18.1a8.047,8.047,0,0,1,6.225-.2L345.931,51.16a8.042,8.042,0,0,1,5.1,8.131l-6.794,81.531L344,140.9V72c0-9.851-12.245-11.464-32.413-12.949-14.7-1.083-34.44-1.679-55.587-1.679s-40.889.6-55.587,1.679C180.245,60.536,168,62.149,168,72v68.9l-.256-.085-6.754-74.3A8.014,8.014,0,0,1,165.6,58.532ZM160,188.687V155.1l8,2.667v38.92Zm62.3,117.535A24.014,24.014,0,0,0,237.918,312h36.163a24.014,24.014,0,0,0,15.619-5.778L304,293.965v53.392l-48,27.429-48-27.429V293.965ZM266.234,432H245.766l-5.87-17.609c3.965-9.3,9.337-18.011,16.1-21.68,6.752,3.669,12.124,12.4,16.094,21.712Zm-42.7-19.872c-1.41,3.666-2.592,7.246-3.57,10.532L192,389.1V360h5.876l42.664,24.379C233.928,390.625,228.236,399.9,223.533,412.128ZM320,389.1,292.037,422.66c-.978-3.286-2.16-6.866-3.57-10.532-4.7-12.227-10.395-21.5-17.006-27.749L314.124,360H320Z");
    			add_location(path1, file$1, 2, 2, 181);
    			attr_dev(path2, "d", "M224,168V152h4.687l5.657,5.657,11.313-11.313-8-8A8,8,0,0,0,232,136H192v16h16v16Z");
    			add_location(path2, file$1, 3, 2, 2619);
    			attr_dev(path3, "d", "M240.572,157.029l-16,40A8,8,0,0,0,232,208h48a8,8,0,0,0,7.428-10.971l-16-40-14.855,5.942L268.184,192H243.816l11.611-29.029Z");
    			add_location(path3, file$1, 4, 2, 2714);
    			attr_dev(path4, "d", "M277.578,232l21.985,14.656,8.875-13.312-24-16A8,8,0,0,0,280,216H240a8,8,0,0,0-4.437,1.344l-24,16,8.875,13.313L242.422,232Z");
    			add_location(path4, file$1, 5, 2, 2851);
    			attr_dev(path5, "d", "M267.578,255.155l16-8-7.155-14.311L262.111,240H240v16h24A8,8,0,0,0,267.578,255.155Z");
    			add_location(path5, file$1, 6, 2, 2988);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 512 512");
    			attr_dev(svg, "class", "me z-depth-3 svelte-zx4jwq");
    			add_location(svg, file$1, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    			append_dev(svg, path2);
    			append_dev(svg, path3);
    			append_dev(svg, path4);
    			append_dev(svg, path5);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Me> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Me", $$slots, []);
    	return [];
    }

    class Me extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Me",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    var посты = [
      {"title": 'All glory to... Gloria',
        "html":'Создал Свелт-приложение из  <a href="https://github.com/sveltejs/template">шаблона</a> ... и пошло-поехало, и все закрутилось ...',
        "code": `
$ cd /path/to/svelte-app
$ npm run dev
$ npm run build
$ surge public mche.us.to

   Running as *******@********* (Student)

        project: public
         domain: mche.us.to
         upload: [====================] 100% eta: 0.0s (227 files, 3275006 bytes)
            CDN: [====================] 100%

             IP: 138.197.235.123

   Success! - Published to mche.us.to

`,},
        /*
        **
        **
        */
      {"title":'Vue кириллические пропсы',
        "html":'Крутяк, но не проверил на сборщиках parcel, rollup',
        "code":`
// HTML
    <v-foo :пропс1=" ... " ></v-foo>
    
// JS компонент Foo
    const props = {
      "пропс1": ...,
      ...
    };
    
`},
    ];

    /* src/App.svelte generated by Svelte v3.24.0 */
    const file$2 = "src/App.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (17:0) { #each posts as p }
    function create_each_block$1(ctx) {
    	let h2;
    	let a;
    	let t0_value = /*p*/ ctx[3].title + "";
    	let t0;
    	let t1;
    	let p;
    	let raw_value = /*p*/ ctx[3].html + "";
    	let t2;
    	let code;
    	let t3_value = /*p*/ ctx[3].code + "";
    	let t3;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			p = element("p");
    			t2 = space();
    			code = element("code");
    			t3 = text(t3_value);
    			attr_dev(a, "href", "javascript:");
    			attr_dev(a, "class", "gr-color svelte-q1yxdb");
    			add_location(a, file$2, 17, 25, 475);
    			attr_dev(h2, "class", "center-000 svelte-q1yxdb");
    			add_location(h2, file$2, 17, 2, 452);
    			add_location(p, file$2, 18, 2, 561);
    			attr_dev(code, "class", "code svelte-q1yxdb");
    			add_location(code, file$2, 19, 2, 586);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, a);
    			append_dev(a, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p, anchor);
    			p.innerHTML = raw_value;
    			insert_dev(target, t2, anchor);
    			insert_dev(target, code, anchor);
    			append_dev(code, t3);

    			if (!mounted) {
    				dispose = listen_dev(
    					a,
    					"click",
    					function () {
    						if (is_function(/*Click*/ ctx[2](/*p*/ ctx[3]))) /*Click*/ ctx[2](/*p*/ ctx[3]).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*posts*/ 2 && t0_value !== (t0_value = /*p*/ ctx[3].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*posts*/ 2 && raw_value !== (raw_value = /*p*/ ctx[3].html + "")) p.innerHTML = raw_value;			if (dirty & /*posts*/ 2 && t3_value !== (t3_value = /*p*/ ctx[3].code + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(code);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(17:0) { #each posts as p }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let main;
    	let div;
    	let clock;
    	let t0;
    	let t1;
    	let h1;
    	let me;
    	let t2;
    	let span0;
    	let t3_value = /*head*/ ctx[0].title + "";
    	let t3;
    	let t4;
    	let span1;
    	let t6;
    	let p0;
    	let a0;
    	let t8;
    	let t9;
    	let p1;
    	let a1;
    	let t11;
    	let t12;
    	let current;
    	clock = new Clock({ $$inline: true });
    	me = new Me({ $$inline: true });
    	let each_value = /*posts*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			div = element("div");
    			create_component(clock.$$.fragment);
    			t0 = text("\n    Это SVG-часы Свелт-компонент.");
    			t1 = space();
    			h1 = element("h1");
    			create_component(me.$$.fragment);
    			t2 = space();
    			span0 = element("span");
    			t3 = text(t3_value);
    			t4 = space();
    			span1 = element("span");
    			span1.textContent = "доброго всем";
    			t6 = space();
    			p0 = element("p");
    			a0 = element("a");
    			a0.textContent = "Svelte учебник";
    			t8 = text(" - на официальном русскоязычном сайтеге.");
    			t9 = space();
    			p1 = element("p");
    			a1 = element("a");
    			a1.textContent = "Телеграм Свелт";
    			t11 = text(" - официальный русскоязычный канал.");
    			t12 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "clock svelte-q1yxdb");
    			add_location(div, file$2, 1, 2, 9);
    			attr_dev(span0, "class", "svelt-color font-effect-3d-float svelte-q1yxdb");
    			add_location(span0, file$2, 7, 4, 108);
    			add_location(span1, file$2, 8, 4, 179);
    			attr_dev(h1, "class", "svelte-q1yxdb");
    			add_location(h1, file$2, 5, 2, 88);
    			attr_dev(a0, "href", "https://ru.svelte.dev/tutorial");
    			add_location(a0, file$2, 12, 5, 226);
    			add_location(p0, file$2, 12, 2, 223);
    			attr_dev(a1, "href", "https://t.me/sveltejs");
    			add_location(a1, file$2, 13, 5, 335);
    			add_location(p1, file$2, 13, 2, 332);
    			attr_dev(main, "class", "svelte-q1yxdb");
    			add_location(main, file$2, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div);
    			mount_component(clock, div, null);
    			append_dev(div, t0);
    			append_dev(main, t1);
    			append_dev(main, h1);
    			mount_component(me, h1, null);
    			append_dev(h1, t2);
    			append_dev(h1, span0);
    			append_dev(span0, t3);
    			append_dev(h1, t4);
    			append_dev(h1, span1);
    			append_dev(main, t6);
    			append_dev(main, p0);
    			append_dev(p0, a0);
    			append_dev(p0, t8);
    			append_dev(main, t9);
    			append_dev(main, p1);
    			append_dev(p1, a1);
    			append_dev(p1, t11);
    			append_dev(main, t12);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(main, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*head*/ 1) && t3_value !== (t3_value = /*head*/ ctx[0].title + "")) set_data_dev(t3, t3_value);

    			if (dirty & /*posts, Click*/ 6) {
    				each_value = /*posts*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(main, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(clock.$$.fragment, local);
    			transition_in(me.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(clock.$$.fragment, local);
    			transition_out(me.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(clock);
    			destroy_component(me);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { head } = $$props;

    	const Click = post => {
    		post.title = " ¡ " + post.title + " ! ";

    		//~     
    		//~ посты.push({"title":'New'});
    		$$invalidate(1, posts); ///!!!! реактивность массива
    	}; //~ console.log('Click', посты);

    	const writable_props = ["head"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);

    	$$self.$set = $$props => {
    		if ("head" in $$props) $$invalidate(0, head = $$props.head);
    	};

    	$$self.$capture_state = () => ({ Clock, Me, посты, head, Click, posts });

    	$$self.$inject_state = $$props => {
    		if ("head" in $$props) $$invalidate(0, head = $$props.head);
    		if ("posts" in $$props) $$invalidate(1, posts = $$props.posts);
    	};

    	let posts;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	 $$invalidate(1, posts = посты);
    	return [head, posts, Click];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { head: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*head*/ ctx[0] === undefined && !("head" in props)) {
    			console.warn("<App> was created without expected prop 'head'");
    		}
    	}

    	get head() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set head(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Head.svelte generated by Svelte v3.24.0 */

    const file$3 = "src/Head.svelte";

    function create_fragment$3(ctx) {
    	let title;
    	let t_value = /*head*/ ctx[0].title + "";
    	let t;

    	const block = {
    		c: function create() {
    			title = element("title");
    			t = text(t_value);
    			add_location(title, file$3, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title, anchor);
    			append_dev(title, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*head*/ 1 && t_value !== (t_value = /*head*/ ctx[0].title + "")) set_data_dev(t, t_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { head } = $$props;
    	const writable_props = ["head"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Head> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Head", $$slots, []);

    	$$self.$set = $$props => {
    		if ("head" in $$props) $$invalidate(0, head = $$props.head);
    	};

    	$$self.$capture_state = () => ({ head });

    	$$self.$inject_state = $$props => {
    		if ("head" in $$props) $$invalidate(0, head = $$props.head);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [head];
    }

    class Head extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { head: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Head",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*head*/ ctx[0] === undefined && !("head" in props)) {
    			console.warn("<Head> was created without expected prop 'head'");
    		}
    	}

    	get head() {
    		throw new Error("<Head>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set head(value) {
    		throw new Error("<Head>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    //~ import Vue from 'vue';
    ///import посты from './посты.js';


    let props = {
      "head": {
        "title": 'Михаил ★ mche.us.to',
      },
      ///посты,
    };

    new App({
      target: document.body,
      props,
    });

    new Head({
      target: document.head,///.body,
      props,
    });

    ///export default app;

}());
//# sourceMappingURL=bundle.js.map
