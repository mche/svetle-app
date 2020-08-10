
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
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
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
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (9:4) {#each [1, 2, 3, 4] as offset}
    function create_each_block_1(ctx) {
    	let circle;
    	let circle_cy_value;
    	let circle_cx_value;

    	const block = {
    		c: function create() {
    			circle = svg_element("circle");
    			attr_dev(circle, "class", "");
    			attr_dev(circle, "r", "1");
    			attr_dev(circle, "cy", circle_cy_value = Math.sin(2 * Math.PI / 60 * (/*minute*/ ctx[6] + /*offset*/ ctx[9])) * (/*r*/ ctx[4] - 12));
    			attr_dev(circle, "cx", circle_cx_value = Math.cos(2 * Math.PI / 60 * (/*minute*/ ctx[6] + /*offset*/ ctx[9])) * (/*r*/ ctx[4] - 12));
    			add_location(circle, file, 9, 6, 418);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, circle, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(circle);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(9:4) {#each [1, 2, 3, 4] as offset}",
    		ctx
    	});

    	return block;
    }

    // (6:2) {#each [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55] as minute}
    function create_each_block(ctx) {
    	let line;
    	let line_class_value;
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
    			attr_dev(line, "class", line_class_value = "major " + (/*minute*/ ctx[6] % 15 ? "" : "major2") + " svelte-1rwfzvw");
    			attr_dev(line, "y1", "35");
    			attr_dev(line, "y2", "45");
    			attr_dev(line, "transform", line_transform_value = "rotate(" + 30 * /*minute*/ ctx[6] + ")");
    			add_location(line, file, 6, 4, 276);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, line, anchor);

    			for (let i = 0; i < 4; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*Math, r*/ 16) {
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

    // (26:4) {#if !(seconds%2) }
    function create_if_block(ctx) {
    	let text_1;
    	let t;

    	const block = {
    		c: function create() {
    			text_1 = svg_element("text");
    			t = text(":");
    			attr_dev(text_1, "x", "-1");
    			attr_dev(text_1, "y", "30");
    			attr_dev(text_1, "class", "minutes tick svelte-1rwfzvw");
    			add_location(text_1, file, 25, 23, 1133);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, text_1, anchor);
    			append_dev(text_1, t);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(text_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(26:4) {#if !(seconds%2) }",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let svg;
    	let circle;
    	let circle_r_value;
    	let line0;
    	let line0_transform_value;
    	let line1;
    	let line1_transform_value;
    	let g;
    	let line2;
    	let line3;
    	let g_transform_value;
    	let text0;

    	let t0_value = (/*hours*/ ctx[0].toString().length === 1
    	? "0" + /*hours*/ ctx[0].toString()
    	: /*hours*/ ctx[0]) + "";

    	let t0;
    	let text1;

    	let t1_value = (/*minutes*/ ctx[1].toString().length === 1
    	? "0" + /*minutes*/ ctx[1].toString()
    	: /*minutes*/ ctx[1]) + "";

    	let t1;
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
    			circle = svg_element("circle");

    			for (let i = 0; i < 12; i += 1) {
    				each_blocks[i].c();
    			}

    			line0 = svg_element("line");
    			line1 = svg_element("line");
    			g = svg_element("g");
    			line2 = svg_element("line");
    			line3 = svg_element("line");
    			text0 = svg_element("text");
    			t0 = text(t0_value);
    			if (if_block) if_block.c();
    			text1 = svg_element("text");
    			t1 = text(t1_value);
    			attr_dev(circle, "class", "clock-face svelte-1rwfzvw");
    			attr_dev(circle, "r", circle_r_value = /*r*/ ctx[4] - 2);
    			add_location(circle, file, 2, 2, 148);
    			attr_dev(line0, "class", "hour svelte-1rwfzvw");
    			attr_dev(line0, "y1", "2");
    			attr_dev(line0, "y2", "-20");
    			attr_dev(line0, "transform", line0_transform_value = "rotate(" + (30 * /*hours*/ ctx[0] + /*minutes*/ ctx[1] / 2) + ")");
    			add_location(line0, file, 14, 2, 608);
    			attr_dev(line1, "class", "minute svelte-1rwfzvw");
    			attr_dev(line1, "y1", "4");
    			attr_dev(line1, "y2", "-30");
    			attr_dev(line1, "transform", line1_transform_value = "rotate(" + (6 * /*minutes*/ ctx[1] + /*seconds*/ ctx[2] / 10) + ")");
    			add_location(line1, file, 17, 2, 722);
    			attr_dev(line2, "class", "second svelte-1rwfzvw");
    			attr_dev(line2, "y1", "10");
    			attr_dev(line2, "y2", "-38");
    			add_location(line2, file, 21, 4, 904);
    			attr_dev(line3, "class", "second-counterweight svelte-1rwfzvw");
    			attr_dev(line3, "y1", "10");
    			attr_dev(line3, "y2", "2");
    			add_location(line3, file, 22, 4, 945);
    			attr_dev(g, "transform", g_transform_value = "rotate(" + 6 * (/*seconds*/ ctx[2] + /*milliseconds*/ ctx[3] / 1000) + ")");
    			add_location(g, file, 20, 2, 840);
    			attr_dev(text0, "x", "-10");
    			attr_dev(text0, "y", "30");
    			attr_dev(text0, "class", "minutes svelte-1rwfzvw");
    			add_location(text0, file, 24, 4, 1005);
    			attr_dev(text1, "x", "2");
    			attr_dev(text1, "y", "30");
    			attr_dev(text1, "class", "minutes svelte-1rwfzvw");
    			add_location(text1, file, 26, 4, 1188);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "viewBox", "-50 -50 100 100");
    			attr_dev(svg, "class", "z-depth-3 green lighten-4 svelte-1rwfzvw");
    			add_location(svg, file, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, circle);

    			for (let i = 0; i < 12; i += 1) {
    				each_blocks[i].m(svg, null);
    			}

    			append_dev(svg, line0);
    			append_dev(svg, line1);
    			append_dev(svg, g);
    			append_dev(g, line2);
    			append_dev(g, line3);
    			append_dev(svg, text0);
    			append_dev(text0, t0);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, text1);
    			append_dev(text1, t1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*Math, r*/ 16) {
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
    						each_blocks[i].m(svg, line0);
    					}
    				}

    				for (; i < 12; i += 1) {
    					each_blocks[i].d(1);
    				}
    			}

    			if (dirty & /*hours, minutes*/ 3 && line0_transform_value !== (line0_transform_value = "rotate(" + (30 * /*hours*/ ctx[0] + /*minutes*/ ctx[1] / 2) + ")")) {
    				attr_dev(line0, "transform", line0_transform_value);
    			}

    			if (dirty & /*minutes, seconds*/ 6 && line1_transform_value !== (line1_transform_value = "rotate(" + (6 * /*minutes*/ ctx[1] + /*seconds*/ ctx[2] / 10) + ")")) {
    				attr_dev(line1, "transform", line1_transform_value);
    			}

    			if (dirty & /*seconds, milliseconds*/ 12 && g_transform_value !== (g_transform_value = "rotate(" + 6 * (/*seconds*/ ctx[2] + /*milliseconds*/ ctx[3] / 1000) + ")")) {
    				attr_dev(g, "transform", g_transform_value);
    			}

    			if (dirty & /*hours*/ 1 && t0_value !== (t0_value = (/*hours*/ ctx[0].toString().length === 1
    			? "0" + /*hours*/ ctx[0].toString()
    			: /*hours*/ ctx[0]) + "")) set_data_dev(t0, t0_value);

    			if (!(/*seconds*/ ctx[2] % 2)) {
    				if (if_block) ; else {
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
    	let r = 50;

    	onMount(() => {
    		const interval = setInterval(
    			() => {
    				$$invalidate(5, time = new Date());
    			},
    			100
    		);

    		return () => {
    			clearInterval(interval);
    		};
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Clock> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Clock", $$slots, []);

    	$$self.$capture_state = () => ({
    		onMount,
    		time,
    		r,
    		hours,
    		minutes,
    		seconds,
    		milliseconds
    	});

    	$$self.$inject_state = $$props => {
    		if ("time" in $$props) $$invalidate(5, time = $$props.time);
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
    		if ($$self.$$.dirty & /*time*/ 32) {
    			// эти переменные автоматически обновляются, каждый раз
    			// когда изменяется `time`, блягодаря префиксу `$:`
    			 $$invalidate(0, hours = time.getHours());
    		}

    		if ($$self.$$.dirty & /*time*/ 32) {
    			 $$invalidate(1, minutes = time.getMinutes());
    		}

    		if ($$self.$$.dirty & /*time*/ 32) {
    			 $$invalidate(2, seconds = time.getSeconds());
    		}

    		if ($$self.$$.dirty & /*time*/ 32) {
    			 $$invalidate(3, milliseconds = time.getMilliseconds());
    		}
    	};

    	return [hours, minutes, seconds, milliseconds, r];
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

    /* src/App.svelte generated by Svelte v3.24.0 */
    const file$1 = "src/App.svelte";

    function create_fragment$1(ctx) {
    	let main;
    	let div;
    	let clock;
    	let t0;
    	let t1;
    	let h1;
    	let t3;
    	let p0;
    	let a0;
    	let t5;
    	let t6;
    	let p1;
    	let a1;
    	let t8;
    	let t9;
    	let h3;
    	let a2;
    	let t10;
    	let t11;
    	let p2;
    	let t12;
    	let a3;
    	let t14;
    	let t15;
    	let p3;
    	let current;
    	let mounted;
    	let dispose;
    	clock = new Clock({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			div = element("div");
    			create_component(clock.$$.fragment);
    			t0 = text("\n    Это SVG-часы Свелт-компонент.");
    			t1 = space();
    			h1 = element("h1");
    			h1.textContent = "Доброго всем";
    			t3 = space();
    			p0 = element("p");
    			a0 = element("a");
    			a0.textContent = "Svelte учебник";
    			t5 = text(" - официальный русскоязычный сайтег.");
    			t6 = space();
    			p1 = element("p");
    			a1 = element("a");
    			a1.textContent = "Телеграм Свелт";
    			t8 = text(" - официальный русскоязычый канал.");
    			t9 = space();
    			h3 = element("h3");
    			a2 = element("a");
    			t10 = text(/*name2*/ ctx[0]);
    			t11 = space();
    			p2 = element("p");
    			t12 = text("Создал Свелт-приложение из  ");
    			a3 = element("a");
    			a3.textContent = "шаблона";
    			t14 = text(" ... и пошло-поехало, все закрутилось ...");
    			t15 = space();
    			p3 = element("p");
    			p3.textContent = "$ cd /path/to/svelte-app\n$ npm run dev\n$ npm run build\n$ surge /path/to/svelte-app/public mche.us.to\n\n   Running as *******@********* (Student)\n\n        project: /path/to/svelte-app/public\n         domain: mche.us.to\n         upload: [====================] 100% eta: 0.0s (227 files, 3275006 bytes)\n            CDN: [====================] 100%\n\n             IP: 138.197.235.123\n\n   Success! - Published to mche.us.to";
    			attr_dev(div, "class", "clock svelte-1fj6odo");
    			add_location(div, file$1, 1, 2, 9);
    			attr_dev(h1, "class", "svelte-1fj6odo");
    			add_location(h1, file$1, 5, 2, 88);
    			attr_dev(a0, "href", "https://ru.svelte.dev/tutorial");
    			add_location(a0, file$1, 7, 5, 118);
    			add_location(p0, file$1, 7, 2, 115);
    			attr_dev(a1, "href", "https://t.me/sveltejs");
    			add_location(a1, file$1, 8, 5, 223);
    			add_location(p1, file$1, 8, 2, 220);
    			attr_dev(a2, "href", "javascript:");
    			attr_dev(a2, "class", "red-text svelte-1fj6odo");
    			add_location(a2, file$1, 10, 6, 321);
    			add_location(h3, file$1, 10, 2, 317);
    			attr_dev(a3, "href", "https://github.com/sveltejs/template");
    			add_location(a3, file$1, 12, 33, 473);
    			add_location(p2, file$1, 12, 2, 442);
    			attr_dev(p3, "class", "code svelte-1fj6odo");
    			add_location(p3, file$1, 13, 2, 579);
    			attr_dev(main, "class", "svelte-1fj6odo");
    			add_location(main, file$1, 0, 0, 0);
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
    			append_dev(main, t3);
    			append_dev(main, p0);
    			append_dev(p0, a0);
    			append_dev(p0, t5);
    			append_dev(main, t6);
    			append_dev(main, p1);
    			append_dev(p1, a1);
    			append_dev(p1, t8);
    			append_dev(main, t9);
    			append_dev(main, h3);
    			append_dev(h3, a2);
    			append_dev(a2, t10);
    			append_dev(main, t11);
    			append_dev(main, p2);
    			append_dev(p2, t12);
    			append_dev(p2, a3);
    			append_dev(p2, t14);
    			append_dev(main, t15);
    			append_dev(main, p3);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a2, "click", /*Click*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*name2*/ 1) set_data_dev(t10, /*name2*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(clock.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(clock.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(clock);
    			mounted = false;
    			dispose();
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

    function instance$1($$self, $$props, $$invalidate) {
    	let { name } = $$props;

    	//~   export let head;
    	const Click = event => {
    		$$invalidate(2, name = " ¡ " + name + " ! ");
    	}; //~     console.log('name', name);
    	///head.title = name;
    	//, 1000, true);

    	Click();
    	const writable_props = ["name"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);

    	$$self.$set = $$props => {
    		if ("name" in $$props) $$invalidate(2, name = $$props.name);
    	};

    	$$self.$capture_state = () => ({ Clock, name, Click, name2 });

    	$$self.$inject_state = $$props => {
    		if ("name" in $$props) $$invalidate(2, name = $$props.name);
    		if ("name2" in $$props) $$invalidate(0, name2 = $$props.name2);
    	};

    	let name2;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*name*/ 4) {
    			//~   $: head.title = name;
    			///$: document.title = name;
    			 $$invalidate(0, name2 = name.toUpperCase());
    		}
    	};

    	return [name2, Click, name];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { name: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[2] === undefined && !("name" in props)) {
    			console.warn("<App> was created without expected prop 'name'");
    		}
    	}

    	get name() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Head.svelte generated by Svelte v3.24.0 */

    const file$2 = "src/Head.svelte";

    function create_fragment$2(ctx) {
    	let title;
    	let t0;
    	let t1_value = /*head*/ ctx[0].title + "";
    	let t1;

    	const block = {
    		c: function create() {
    			title = element("title");
    			t0 = text("Svelte App ★ ");
    			t1 = text(t1_value);
    			add_location(title, file$2, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title, anchor);
    			append_dev(title, t0);
    			append_dev(title, t1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*head*/ 1 && t1_value !== (t1_value = /*head*/ ctx[0].title + "")) set_data_dev(t1, t1_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title);
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
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { head: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Head",
    			options,
    			id: create_fragment$2.name
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


    let props = {
      //~ Vue,
      name: 'All Glory to Gloria',
      "head": {
        "title": 'mche.us.to',
      },
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
