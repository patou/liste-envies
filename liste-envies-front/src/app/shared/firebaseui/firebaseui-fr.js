(function () {
    var firebase = require('firebase/app'); require('firebase/auth');/*

 Copyright 2015 Google Inc. All Rights Reserved.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
    var componentHandler = { upgradeDom: function (optJsClass, optCssClass) { }, upgradeElement: function (element, optJsClass) { }, upgradeElements: function (elements) { }, upgradeAllRegistered: function () { }, registerUpgradedCallback: function (jsClass, callback) { }, register: function (config) { }, downgradeElements: function (nodes) { } };
    componentHandler = function () {
        var registeredComponents_ = []; var createdComponents_ = []; var componentConfigProperty_ = "mdlComponentConfigInternal_"; function findRegisteredClass_(name, optReplace) { for (var i = 0; i < registeredComponents_.length; i++)if (registeredComponents_[i].className === name) { if (typeof optReplace !== "undefined") registeredComponents_[i] = optReplace; return registeredComponents_[i] } return false } function getUpgradedListOfElement_(element) {
            var dataUpgraded = element.getAttribute("data-upgraded"); return dataUpgraded ===
                null ? [""] : dataUpgraded.split(",")
        } function isElementUpgraded_(element, jsClass) { var upgradedList = getUpgradedListOfElement_(element); return upgradedList.indexOf(jsClass) !== -1 } function createEvent_(eventType, bubbles, cancelable) { if ("CustomEvent" in window && typeof window.CustomEvent === "function") return new CustomEvent(eventType, { bubbles: bubbles, cancelable: cancelable }); else { var ev = document.createEvent("Events"); ev.initEvent(eventType, bubbles, cancelable); return ev } } function upgradeDomInternal(optJsClass,
            optCssClass) {
                if (typeof optJsClass === "undefined" && typeof optCssClass === "undefined") for (var i = 0; i < registeredComponents_.length; i++)upgradeDomInternal(registeredComponents_[i].className, registeredComponents_[i].cssClass); else {
                    var jsClass = optJsClass; if (typeof optCssClass === "undefined") { var registeredClass = findRegisteredClass_(jsClass); if (registeredClass) optCssClass = registeredClass.cssClass } var elements = document.querySelectorAll("." + optCssClass); for (var n = 0; n < elements.length; n++)upgradeElementInternal(elements[n],
                        jsClass)
                }
        } function upgradeElementInternal(element, optJsClass) {
            if (!(typeof element === "object" && element instanceof Element)) throw new Error("Invalid argument provided to upgrade MDL element."); var upgradingEv = createEvent_("mdl-componentupgrading", true, true); element.dispatchEvent(upgradingEv); if (upgradingEv.defaultPrevented) return; var upgradedList = getUpgradedListOfElement_(element); var classesToUpgrade = []; if (!optJsClass) {
                var classList = element.classList; registeredComponents_.forEach(function (component) {
                    if (classList.contains(component.cssClass) &&
                        classesToUpgrade.indexOf(component) === -1 && !isElementUpgraded_(element, component.className)) classesToUpgrade.push(component)
                })
            } else if (!isElementUpgraded_(element, optJsClass)) classesToUpgrade.push(findRegisteredClass_(optJsClass)); for (var i = 0, n = classesToUpgrade.length, registeredClass; i < n; i++) {
                registeredClass = classesToUpgrade[i]; if (registeredClass) {
                    upgradedList.push(registeredClass.className); element.setAttribute("data-upgraded", upgradedList.join(",")); var instance = new registeredClass.classConstructor(element);
                    instance[componentConfigProperty_] = registeredClass; createdComponents_.push(instance); for (var j = 0, m = registeredClass.callbacks.length; j < m; j++)registeredClass.callbacks[j](element); if (registeredClass.widget) element[registeredClass.className] = instance
                } else throw new Error("Unable to find a registered component for the given class."); var upgradedEv = createEvent_("mdl-componentupgraded", true, false); element.dispatchEvent(upgradedEv)
            }
        } function upgradeElementsInternal(elements) {
            if (!Array.isArray(elements)) if (elements instanceof
                Element) elements = [elements]; else elements = Array.prototype.slice.call(elements); for (var i = 0, n = elements.length, element; i < n; i++) { element = elements[i]; if (element instanceof HTMLElement) { upgradeElementInternal(element); if (element.children.length > 0) upgradeElementsInternal(element.children) } }
        } function registerInternal(config) {
            var widgetMissing = typeof config.widget === "undefined" && typeof config["widget"] === "undefined"; var widget = true; if (!widgetMissing) widget = config.widget || config["widget"]; var newConfig = {
                classConstructor: config.constructor ||
                    config["constructor"], className: config.classAsString || config["classAsString"], cssClass: config.cssClass || config["cssClass"], widget: widget, callbacks: []
            }; registeredComponents_.forEach(function (item) { if (item.cssClass === newConfig.cssClass) throw new Error("The provided cssClass has already been registered: " + item.cssClass); if (item.className === newConfig.className) throw new Error("The provided className has already been registered"); }); if (config.constructor.prototype.hasOwnProperty(componentConfigProperty_)) throw new Error("MDL component classes must not have " +
                componentConfigProperty_ + " defined as a property."); var found = findRegisteredClass_(config.classAsString, newConfig); if (!found) registeredComponents_.push(newConfig)
        } function registerUpgradedCallbackInternal(jsClass, callback) { var regClass = findRegisteredClass_(jsClass); if (regClass) regClass.callbacks.push(callback) } function upgradeAllRegisteredInternal() { for (var n = 0; n < registeredComponents_.length; n++)upgradeDomInternal(registeredComponents_[n].className) } function deconstructComponentInternal(component) {
            if (component) {
                var componentIndex =
                    createdComponents_.indexOf(component); createdComponents_.splice(componentIndex, 1); var upgrades = component.element_.getAttribute("data-upgraded").split(","); var componentPlace = upgrades.indexOf(component[componentConfigProperty_].classAsString); upgrades.splice(componentPlace, 1); component.element_.setAttribute("data-upgraded", upgrades.join(",")); var ev = createEvent_("mdl-componentdowngraded", true, false); component.element_.dispatchEvent(ev)
            }
        } function downgradeNodesInternal(nodes) {
            var downgradeNode = function (node) {
                createdComponents_.filter(function (item) {
                    return item.element_ ===
                        node
                }).forEach(deconstructComponentInternal)
            }; if (nodes instanceof Array || nodes instanceof NodeList) for (var n = 0; n < nodes.length; n++)downgradeNode(nodes[n]); else if (nodes instanceof Node) downgradeNode(nodes); else throw new Error("Invalid argument provided to downgrade MDL nodes.");
        } return {
            upgradeDom: upgradeDomInternal, upgradeElement: upgradeElementInternal, upgradeElements: upgradeElementsInternal, upgradeAllRegistered: upgradeAllRegisteredInternal, registerUpgradedCallback: registerUpgradedCallbackInternal,
            register: registerInternal, downgradeElements: downgradeNodesInternal
        }
    }(); componentHandler.ComponentConfigPublic; componentHandler.ComponentConfig; componentHandler.Component; componentHandler["upgradeDom"] = componentHandler.upgradeDom; componentHandler["upgradeElement"] = componentHandler.upgradeElement; componentHandler["upgradeElements"] = componentHandler.upgradeElements; componentHandler["upgradeAllRegistered"] = componentHandler.upgradeAllRegistered; componentHandler["registerUpgradedCallback"] = componentHandler.registerUpgradedCallback;
    componentHandler["register"] = componentHandler.register; componentHandler["downgradeElements"] = componentHandler.downgradeElements; window.componentHandler = componentHandler; window["componentHandler"] = componentHandler;
    window.addEventListener("load", function () { if ("classList" in document.createElement("div") && "querySelector" in document && "addEventListener" in window && Array.prototype.forEach) { document.documentElement.classList.add("mdl-js"); componentHandler.upgradeAllRegistered() } else { componentHandler.upgradeElement = function () { }; componentHandler.register = function () { } } }); (function () {
        var MaterialButton = function MaterialButton(element) { this.element_ = element; this.init() }; window["MaterialButton"] = MaterialButton; MaterialButton.prototype.Constant_ = {}; MaterialButton.prototype.CssClasses_ = { RIPPLE_EFFECT: "mdl-js-ripple-effect", RIPPLE_CONTAINER: "mdl-button__ripple-container", RIPPLE: "mdl-ripple" }; MaterialButton.prototype.blurHandler_ = function (event) { if (event) this.element_.blur() }; MaterialButton.prototype.disable = function () { this.element_.disabled = true }; MaterialButton.prototype["disable"] =
            MaterialButton.prototype.disable; MaterialButton.prototype.enable = function () { this.element_.disabled = false }; MaterialButton.prototype["enable"] = MaterialButton.prototype.enable; MaterialButton.prototype.init = function () {
                if (this.element_) {
                    if (this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
                        var rippleContainer = document.createElement("span"); rippleContainer.classList.add(this.CssClasses_.RIPPLE_CONTAINER); this.rippleElement_ = document.createElement("span"); this.rippleElement_.classList.add(this.CssClasses_.RIPPLE);
                        rippleContainer.appendChild(this.rippleElement_); this.boundRippleBlurHandler = this.blurHandler_.bind(this); this.rippleElement_.addEventListener("mouseup", this.boundRippleBlurHandler); this.element_.appendChild(rippleContainer)
                    } this.boundButtonBlurHandler = this.blurHandler_.bind(this); this.element_.addEventListener("mouseup", this.boundButtonBlurHandler); this.element_.addEventListener("mouseleave", this.boundButtonBlurHandler)
                }
            }; componentHandler.register({
                constructor: MaterialButton, classAsString: "MaterialButton",
                cssClass: "mdl-js-button", widget: true
            })
    })(); (function () {
        var MaterialProgress = function MaterialProgress(element) { this.element_ = element; this.init() }; window["MaterialProgress"] = MaterialProgress; MaterialProgress.prototype.Constant_ = {}; MaterialProgress.prototype.CssClasses_ = { INDETERMINATE_CLASS: "mdl-progress__indeterminate" }; MaterialProgress.prototype.setProgress = function (p) { if (this.element_.classList.contains(this.CssClasses_.INDETERMINATE_CLASS)) return; this.progressbar_.style.width = p + "%" }; MaterialProgress.prototype["setProgress"] = MaterialProgress.prototype.setProgress;
        MaterialProgress.prototype.setBuffer = function (p) { this.bufferbar_.style.width = p + "%"; this.auxbar_.style.width = 100 - p + "%" }; MaterialProgress.prototype["setBuffer"] = MaterialProgress.prototype.setBuffer; MaterialProgress.prototype.init = function () {
            if (this.element_) {
                var el = document.createElement("div"); el.className = "progressbar bar bar1"; this.element_.appendChild(el); this.progressbar_ = el; el = document.createElement("div"); el.className = "bufferbar bar bar2"; this.element_.appendChild(el); this.bufferbar_ = el; el = document.createElement("div");
                el.className = "auxbar bar bar3"; this.element_.appendChild(el); this.auxbar_ = el; this.progressbar_.style.width = "0%"; this.bufferbar_.style.width = "100%"; this.auxbar_.style.width = "0%"; this.element_.classList.add("is-upgraded")
            }
        }; componentHandler.register({ constructor: MaterialProgress, classAsString: "MaterialProgress", cssClass: "mdl-js-progress", widget: true })
    })(); (function () {
        var MaterialSpinner = function MaterialSpinner(element) { this.element_ = element; this.init() }; window["MaterialSpinner"] = MaterialSpinner; MaterialSpinner.prototype.Constant_ = { MDL_SPINNER_LAYER_COUNT: 4 }; MaterialSpinner.prototype.CssClasses_ = { MDL_SPINNER_LAYER: "mdl-spinner__layer", MDL_SPINNER_CIRCLE_CLIPPER: "mdl-spinner__circle-clipper", MDL_SPINNER_CIRCLE: "mdl-spinner__circle", MDL_SPINNER_GAP_PATCH: "mdl-spinner__gap-patch", MDL_SPINNER_LEFT: "mdl-spinner__left", MDL_SPINNER_RIGHT: "mdl-spinner__right" };
        MaterialSpinner.prototype.createLayer = function (index) {
            var layer = document.createElement("div"); layer.classList.add(this.CssClasses_.MDL_SPINNER_LAYER); layer.classList.add(this.CssClasses_.MDL_SPINNER_LAYER + "-" + index); var leftClipper = document.createElement("div"); leftClipper.classList.add(this.CssClasses_.MDL_SPINNER_CIRCLE_CLIPPER); leftClipper.classList.add(this.CssClasses_.MDL_SPINNER_LEFT); var gapPatch = document.createElement("div"); gapPatch.classList.add(this.CssClasses_.MDL_SPINNER_GAP_PATCH); var rightClipper =
                document.createElement("div"); rightClipper.classList.add(this.CssClasses_.MDL_SPINNER_CIRCLE_CLIPPER); rightClipper.classList.add(this.CssClasses_.MDL_SPINNER_RIGHT); var circleOwners = [leftClipper, gapPatch, rightClipper]; for (var i = 0; i < circleOwners.length; i++) { var circle = document.createElement("div"); circle.classList.add(this.CssClasses_.MDL_SPINNER_CIRCLE); circleOwners[i].appendChild(circle) } layer.appendChild(leftClipper); layer.appendChild(gapPatch); layer.appendChild(rightClipper); this.element_.appendChild(layer)
        };
        MaterialSpinner.prototype["createLayer"] = MaterialSpinner.prototype.createLayer; MaterialSpinner.prototype.stop = function () { this.element_.classList.remove("is-active") }; MaterialSpinner.prototype["stop"] = MaterialSpinner.prototype.stop; MaterialSpinner.prototype.start = function () { this.element_.classList.add("is-active") }; MaterialSpinner.prototype["start"] = MaterialSpinner.prototype.start; MaterialSpinner.prototype.init = function () {
            if (this.element_) {
                for (var i = 1; i <= this.Constant_.MDL_SPINNER_LAYER_COUNT; i++)this.createLayer(i);
                this.element_.classList.add("is-upgraded")
            }
        }; componentHandler.register({ constructor: MaterialSpinner, classAsString: "MaterialSpinner", cssClass: "mdl-js-spinner", widget: true })
    })(); (function () {
        var MaterialTextfield = function MaterialTextfield(element) { this.element_ = element; this.maxRows = this.Constant_.NO_MAX_ROWS; this.init() }; window["MaterialTextfield"] = MaterialTextfield; MaterialTextfield.prototype.Constant_ = { NO_MAX_ROWS: -1, MAX_ROWS_ATTRIBUTE: "maxrows" }; MaterialTextfield.prototype.CssClasses_ = { LABEL: "mdl-textfield__label", INPUT: "mdl-textfield__input", IS_DIRTY: "is-dirty", IS_FOCUSED: "is-focused", IS_DISABLED: "is-disabled", IS_INVALID: "is-invalid", IS_UPGRADED: "is-upgraded", HAS_PLACEHOLDER: "has-placeholder" };
        MaterialTextfield.prototype.onKeyDown_ = function (event) { var currentRowCount = event.target.value.split("\n").length; if (event.keyCode === 13) if (currentRowCount >= this.maxRows) event.preventDefault() }; MaterialTextfield.prototype.onFocus_ = function (event) { this.element_.classList.add(this.CssClasses_.IS_FOCUSED) }; MaterialTextfield.prototype.onBlur_ = function (event) { this.element_.classList.remove(this.CssClasses_.IS_FOCUSED) }; MaterialTextfield.prototype.onReset_ = function (event) { this.updateClasses_() }; MaterialTextfield.prototype.updateClasses_ =
            function () { this.checkDisabled(); this.checkValidity(); this.checkDirty(); this.checkFocus() }; MaterialTextfield.prototype.checkDisabled = function () { if (this.input_.disabled) this.element_.classList.add(this.CssClasses_.IS_DISABLED); else this.element_.classList.remove(this.CssClasses_.IS_DISABLED) }; MaterialTextfield.prototype["checkDisabled"] = MaterialTextfield.prototype.checkDisabled; MaterialTextfield.prototype.checkFocus = function () {
                if (Boolean(this.element_.querySelector(":focus"))) this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
                else this.element_.classList.remove(this.CssClasses_.IS_FOCUSED)
            }; MaterialTextfield.prototype["checkFocus"] = MaterialTextfield.prototype.checkFocus; MaterialTextfield.prototype.checkValidity = function () { if (this.input_.validity) if (this.input_.validity.valid) this.element_.classList.remove(this.CssClasses_.IS_INVALID); else this.element_.classList.add(this.CssClasses_.IS_INVALID) }; MaterialTextfield.prototype["checkValidity"] = MaterialTextfield.prototype.checkValidity; MaterialTextfield.prototype.checkDirty =
                function () { if (this.input_.value && this.input_.value.length > 0) this.element_.classList.add(this.CssClasses_.IS_DIRTY); else this.element_.classList.remove(this.CssClasses_.IS_DIRTY) }; MaterialTextfield.prototype["checkDirty"] = MaterialTextfield.prototype.checkDirty; MaterialTextfield.prototype.disable = function () { this.input_.disabled = true; this.updateClasses_() }; MaterialTextfield.prototype["disable"] = MaterialTextfield.prototype.disable; MaterialTextfield.prototype.enable = function () {
                    this.input_.disabled = false;
                    this.updateClasses_()
                }; MaterialTextfield.prototype["enable"] = MaterialTextfield.prototype.enable; MaterialTextfield.prototype.change = function (value) { this.input_.value = value || ""; this.updateClasses_() }; MaterialTextfield.prototype["change"] = MaterialTextfield.prototype.change; MaterialTextfield.prototype.init = function () {
                    if (this.element_) {
                    this.label_ = this.element_.querySelector("." + this.CssClasses_.LABEL); this.input_ = this.element_.querySelector("." + this.CssClasses_.INPUT); if (this.input_) {
                        if (this.input_.hasAttribute(this.Constant_.MAX_ROWS_ATTRIBUTE)) {
                        this.maxRows =
                            parseInt(this.input_.getAttribute(this.Constant_.MAX_ROWS_ATTRIBUTE), 10); if (isNaN(this.maxRows)) this.maxRows = this.Constant_.NO_MAX_ROWS
                        } if (this.input_.hasAttribute("placeholder")) this.element_.classList.add(this.CssClasses_.HAS_PLACEHOLDER); this.boundUpdateClassesHandler = this.updateClasses_.bind(this); this.boundFocusHandler = this.onFocus_.bind(this); this.boundBlurHandler = this.onBlur_.bind(this); this.boundResetHandler = this.onReset_.bind(this); this.input_.addEventListener("input", this.boundUpdateClassesHandler);
                        this.input_.addEventListener("focus", this.boundFocusHandler); this.input_.addEventListener("blur", this.boundBlurHandler); this.input_.addEventListener("reset", this.boundResetHandler); if (this.maxRows !== this.Constant_.NO_MAX_ROWS) { this.boundKeyDownHandler = this.onKeyDown_.bind(this); this.input_.addEventListener("keydown", this.boundKeyDownHandler) } var invalid = this.element_.classList.contains(this.CssClasses_.IS_INVALID); this.updateClasses_(); this.element_.classList.add(this.CssClasses_.IS_UPGRADED); if (invalid) this.element_.classList.add(this.CssClasses_.IS_INVALID);
                        if (this.input_.hasAttribute("autofocus")) { this.element_.focus(); this.checkFocus() }
                    }
                    }
                }; componentHandler.register({ constructor: MaterialTextfield, classAsString: "MaterialTextfield", cssClass: "mdl-js-textfield", widget: true })
    })(); (function () {
        var supportCustomEvent = window.CustomEvent; if (!supportCustomEvent || typeof supportCustomEvent === "object") { supportCustomEvent = function CustomEvent(event, x) { x = x || {}; var ev = document.createEvent("CustomEvent"); ev.initCustomEvent(event, !!x.bubbles, !!x.cancelable, x.detail || null); return ev }; supportCustomEvent.prototype = window.Event.prototype } function createsStackingContext(el) {
            while (el && el !== document.body) {
                var s = window.getComputedStyle(el); var invalid = function (k, ok) {
                    return !(s[k] === undefined || s[k] ===
                        ok)
                }; if (s.opacity < 1 || invalid("zIndex", "auto") || invalid("transform", "none") || invalid("mixBlendMode", "normal") || invalid("filter", "none") || invalid("perspective", "none") || s["isolation"] === "isolate" || s.position === "fixed" || s.webkitOverflowScrolling === "touch") return true; el = el.parentElement
            } return false
        } function findNearestDialog(el) { while (el) { if (el.localName === "dialog") return el; el = el.parentElement } return null } function safeBlur(el) { if (el && el.blur && el !== document.body) el.blur() } function inNodeList(nodeList,
            node) { for (var i = 0; i < nodeList.length; ++i)if (nodeList[i] === node) return true; return false } function isFormMethodDialog(el) { if (!el || !el.hasAttribute("method")) return false; return el.getAttribute("method").toLowerCase() === "dialog" } function dialogPolyfillInfo(dialog) {
            this.dialog_ = dialog; this.replacedStyleTop_ = false; this.openAsModal_ = false; if (!dialog.hasAttribute("role")) dialog.setAttribute("role", "dialog"); dialog.show = this.show.bind(this); dialog.showModal = this.showModal.bind(this); dialog.close = this.close.bind(this);
                if (!("returnValue" in dialog)) dialog.returnValue = ""; if ("MutationObserver" in window) { var mo = new MutationObserver(this.maybeHideModal.bind(this)); mo.observe(dialog, { attributes: true, attributeFilter: ["open"] }) } else {
                    var removed = false; var cb = function () { removed ? this.downgradeModal() : this.maybeHideModal(); removed = false }.bind(this); var timeout; var delayModel = function (ev) {
                        if (ev.target !== dialog) return; var cand = "DOMNodeRemoved"; removed |= ev.type.substr(0, cand.length) === cand; window.clearTimeout(timeout); timeout =
                            window.setTimeout(cb, 0)
                    };["DOMAttrModified", "DOMNodeRemoved", "DOMNodeRemovedFromDocument"].forEach(function (name) { dialog.addEventListener(name, delayModel) })
                } Object.defineProperty(dialog, "open", { set: this.setOpen.bind(this), get: dialog.hasAttribute.bind(dialog, "open") }); this.backdrop_ = document.createElement("div"); this.backdrop_.className = "backdrop"; this.backdrop_.addEventListener("click", this.backdropClick_.bind(this))
            } dialogPolyfillInfo.prototype = {
                get dialog() { return this.dialog_ }, maybeHideModal: function () {
                    if (this.dialog_.hasAttribute("open") &&
                        document.body.contains(this.dialog_)) return; this.downgradeModal()
                }, downgradeModal: function () { if (!this.openAsModal_) return; this.openAsModal_ = false; this.dialog_.style.zIndex = ""; if (this.replacedStyleTop_) { this.dialog_.style.top = ""; this.replacedStyleTop_ = false } this.backdrop_.parentNode && this.backdrop_.parentNode.removeChild(this.backdrop_); dialogPolyfill.dm.removeDialog(this) }, setOpen: function (value) {
                    if (value) this.dialog_.hasAttribute("open") || this.dialog_.setAttribute("open", ""); else {
                        this.dialog_.removeAttribute("open");
                        this.maybeHideModal()
                    }
                }, backdropClick_: function (e) {
                    if (!this.dialog_.hasAttribute("tabindex")) { var fake = document.createElement("div"); this.dialog_.insertBefore(fake, this.dialog_.firstChild); fake.tabIndex = -1; fake.focus(); this.dialog_.removeChild(fake) } else this.dialog_.focus(); var redirectedEvent = document.createEvent("MouseEvents"); redirectedEvent.initMouseEvent(e.type, e.bubbles, e.cancelable, window, e.detail, e.screenX, e.screenY, e.clientX, e.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.button, e.relatedTarget);
                    this.dialog_.dispatchEvent(redirectedEvent); e.stopPropagation()
                }, focus_: function () { var target = this.dialog_.querySelector("[autofocus]:not([disabled])"); if (!target && this.dialog_.tabIndex >= 0) target = this.dialog_; if (!target) { var opts = ["button", "input", "keygen", "select", "textarea"]; var query = opts.map(function (el) { return el + ":not([disabled])" }); query.push('[tabindex]:not([disabled]):not([tabindex=""])'); target = this.dialog_.querySelector(query.join(", ")) } safeBlur(document.activeElement); target && target.focus() },
                updateZIndex: function (dialogZ, backdropZ) { if (dialogZ < backdropZ) throw new Error("dialogZ should never be < backdropZ"); this.dialog_.style.zIndex = dialogZ; this.backdrop_.style.zIndex = backdropZ }, show: function () { if (!this.dialog_.open) { this.setOpen(true); this.focus_() } }, showModal: function () {
                    if (this.dialog_.hasAttribute("open")) throw new Error("Failed to execute 'showModal' on dialog: The element is already open, and therefore cannot be opened modally."); if (!document.body.contains(this.dialog_)) throw new Error("Failed to execute 'showModal' on dialog: The element is not in a Document.");
                    if (!dialogPolyfill.dm.pushDialog(this)) throw new Error("Failed to execute 'showModal' on dialog: There are too many open modal dialogs."); if (createsStackingContext(this.dialog_.parentElement)) console.warn("A dialog is being shown inside a stacking context. " + "This may cause it to be unusable. For more information, see this link: " + "https://github.com/GoogleChrome/dialog-polyfill/#stacking-context"); this.setOpen(true); this.openAsModal_ = true; if (dialogPolyfill.needsCentering(this.dialog_)) {
                        dialogPolyfill.reposition(this.dialog_);
                        this.replacedStyleTop_ = true
                    } else this.replacedStyleTop_ = false; this.dialog_.parentNode.insertBefore(this.backdrop_, this.dialog_.nextSibling); this.focus_()
                }, close: function (opt_returnValue) {
                    if (!this.dialog_.hasAttribute("open")) throw new Error("Failed to execute 'close' on dialog: The element does not have an 'open' attribute, and therefore cannot be closed."); this.setOpen(false); if (opt_returnValue !== undefined) this.dialog_.returnValue = opt_returnValue; var closeEvent = new supportCustomEvent("close", {
                        bubbles: false,
                        cancelable: false
                    }); this.dialog_.dispatchEvent(closeEvent)
                }
            }; var dialogPolyfill = {}; dialogPolyfill.reposition = function (element) { var scrollTop = document.body.scrollTop || document.documentElement.scrollTop; var topValue = scrollTop + (window.innerHeight - element.offsetHeight) / 2; element.style.top = Math.max(scrollTop, topValue) + "px" }; dialogPolyfill.isInlinePositionSetByStylesheet = function (element) {
                for (var i = 0; i < document.styleSheets.length; ++i) {
                    var styleSheet = document.styleSheets[i]; var cssRules = null; try {
                        cssRules =
                        styleSheet.cssRules
                    } catch (e) { } if (!cssRules) continue; for (var j = 0; j < cssRules.length; ++j) { var rule = cssRules[j]; var selectedNodes = null; try { selectedNodes = document.querySelectorAll(rule.selectorText) } catch (e$0) { } if (!selectedNodes || !inNodeList(selectedNodes, element)) continue; var cssTop = rule.style.getPropertyValue("top"); var cssBottom = rule.style.getPropertyValue("bottom"); if (cssTop && cssTop !== "auto" || cssBottom && cssBottom !== "auto") return true }
                } return false
            }; dialogPolyfill.needsCentering = function (dialog) {
                var computedStyle =
                    window.getComputedStyle(dialog); if (computedStyle.position !== "absolute") return false; if (dialog.style.top !== "auto" && dialog.style.top !== "" || dialog.style.bottom !== "auto" && dialog.style.bottom !== "") return false; return !dialogPolyfill.isInlinePositionSetByStylesheet(dialog)
            }; dialogPolyfill.forceRegisterDialog = function (element) {
                if (window.HTMLDialogElement || element.showModal) console.warn("This browser already supports <dialog>, the polyfill " + "may not work correctly", element); if (element.localName !== "dialog") throw new Error("Failed to register dialog: The element is not a dialog.");
                new dialogPolyfillInfo(element)
            }; dialogPolyfill.registerDialog = function (element) { if (!element.showModal) dialogPolyfill.forceRegisterDialog(element) }; dialogPolyfill.DialogManager = function () {
            this.pendingDialogStack = []; var checkDOM = this.checkDOM_.bind(this); this.overlay = document.createElement("div"); this.overlay.className = "_dialog_overlay"; this.overlay.addEventListener("click", function (e) { this.forwardTab_ = undefined; e.stopPropagation(); checkDOM([]) }.bind(this)); this.handleKey_ = this.handleKey_.bind(this);
                this.handleFocus_ = this.handleFocus_.bind(this); this.zIndexLow_ = 1E5; this.zIndexHigh_ = 1E5 + 150; this.forwardTab_ = undefined; if ("MutationObserver" in window) this.mo_ = new MutationObserver(function (records) { var removed = []; records.forEach(function (rec) { for (var i = 0, c; c = rec.removedNodes[i]; ++i) { if (!(c instanceof Element)) continue; else if (c.localName === "dialog") removed.push(c); removed = removed.concat(c.querySelectorAll("dialog")) } }); removed.length && checkDOM(removed) })
            }; dialogPolyfill.DialogManager.prototype.blockDocument =
                function () { document.documentElement.addEventListener("focus", this.handleFocus_, true); document.addEventListener("keydown", this.handleKey_); this.mo_ && this.mo_.observe(document, { childList: true, subtree: true }) }; dialogPolyfill.DialogManager.prototype.unblockDocument = function () { document.documentElement.removeEventListener("focus", this.handleFocus_, true); document.removeEventListener("keydown", this.handleKey_); this.mo_ && this.mo_.disconnect() }; dialogPolyfill.DialogManager.prototype.updateStacking = function () {
                    var zIndex =
                        this.zIndexHigh_; for (var i = 0, dpi; dpi = this.pendingDialogStack[i]; ++i) { dpi.updateZIndex(--zIndex, --zIndex); if (i === 0) this.overlay.style.zIndex = --zIndex } var last = this.pendingDialogStack[0]; if (last) { var p = last.dialog.parentNode || document.body; p.appendChild(this.overlay) } else if (this.overlay.parentNode) this.overlay.parentNode.removeChild(this.overlay)
                }; dialogPolyfill.DialogManager.prototype.containedByTopDialog_ = function (candidate) {
                    while (candidate = findNearestDialog(candidate)) {
                        for (var i = 0, dpi; dpi = this.pendingDialogStack[i]; ++i)if (dpi.dialog ===
                            candidate) return i === 0; candidate = candidate.parentElement
                    } return false
                }; dialogPolyfill.DialogManager.prototype.handleFocus_ = function (event) {
                    if (this.containedByTopDialog_(event.target)) return; event.preventDefault(); event.stopPropagation(); safeBlur(event.target); if (this.forwardTab_ === undefined) return; var dpi = this.pendingDialogStack[0]; var dialog = dpi.dialog; var position = dialog.compareDocumentPosition(event.target); if (position & Node.DOCUMENT_POSITION_PRECEDING) if (this.forwardTab_) dpi.focus_(); else document.documentElement.focus();
                    else; return false
                }; dialogPolyfill.DialogManager.prototype.handleKey_ = function (event) { this.forwardTab_ = undefined; if (event.keyCode === 27) { event.preventDefault(); event.stopPropagation(); var cancelEvent = new supportCustomEvent("cancel", { bubbles: false, cancelable: true }); var dpi = this.pendingDialogStack[0]; if (dpi && dpi.dialog.dispatchEvent(cancelEvent)) dpi.dialog.close() } else if (event.keyCode === 9) this.forwardTab_ = !event.shiftKey }; dialogPolyfill.DialogManager.prototype.checkDOM_ = function (removed) {
                    var clone = this.pendingDialogStack.slice();
                    clone.forEach(function (dpi) { if (removed.indexOf(dpi.dialog) !== -1) dpi.downgradeModal(); else dpi.maybeHideModal() })
                }; dialogPolyfill.DialogManager.prototype.pushDialog = function (dpi) { var allowed = (this.zIndexHigh_ - this.zIndexLow_) / 2 - 1; if (this.pendingDialogStack.length >= allowed) return false; if (this.pendingDialogStack.unshift(dpi) === 1) this.blockDocument(); this.updateStacking(); return true }; dialogPolyfill.DialogManager.prototype.removeDialog = function (dpi) {
                    var index = this.pendingDialogStack.indexOf(dpi); if (index ===
                        -1) return; this.pendingDialogStack.splice(index, 1); if (this.pendingDialogStack.length === 0) this.unblockDocument(); this.updateStacking()
                }; dialogPolyfill.dm = new dialogPolyfill.DialogManager; dialogPolyfill.formSubmitter = null; dialogPolyfill.useValue = null; if (window.HTMLDialogElement === undefined) {
                    var replacementFormSubmit = function () { if (!isFormMethodDialog(this)) return nativeFormSubmit.call(this); var dialog = findNearestDialog(this); dialog && dialog.close() }; var testForm = document.createElement("form"); testForm.setAttribute("method",
                        "dialog"); if (testForm.method !== "dialog") {
                            var methodDescriptor = Object.getOwnPropertyDescriptor(HTMLFormElement.prototype, "method"); if (methodDescriptor) {
                                var realGet = methodDescriptor.get; methodDescriptor.get = function () { if (isFormMethodDialog(this)) return "dialog"; return realGet.call(this) }; var realSet = methodDescriptor.set; methodDescriptor.set = function (v) { if (typeof v === "string" && v.toLowerCase() === "dialog") return this.setAttribute("method", v); return realSet.call(this, v) }; Object.defineProperty(HTMLFormElement.prototype,
                                    "method", methodDescriptor)
                            }
                        } document.addEventListener("click", function (ev) {
                        dialogPolyfill.formSubmitter = null; dialogPolyfill.useValue = null; if (ev.defaultPrevented) return; var target = ev.target; if (!target || !isFormMethodDialog(target.form)) return; var valid = target.type === "submit" && ["button", "input"].indexOf(target.localName) > -1; if (!valid) { if (!(target.localName === "input" && target.type === "image")) return; dialogPolyfill.useValue = ev.offsetX + "," + ev.offsetY } var dialog = findNearestDialog(target); if (!dialog) return;
                            dialogPolyfill.formSubmitter = target
                        }, false); var nativeFormSubmit = HTMLFormElement.prototype.submit; HTMLFormElement.prototype.submit = replacementFormSubmit; document.addEventListener("submit", function (ev) { var form = ev.target; if (!isFormMethodDialog(form)) return; ev.preventDefault(); var dialog = findNearestDialog(form); if (!dialog) return; var s = dialogPolyfill.formSubmitter; if (s && s.form === form) dialog.close(dialogPolyfill.useValue || s.value); else dialog.close(); dialogPolyfill.formSubmitter = null }, true)
                } dialogPolyfill["forceRegisterDialog"] =
                    dialogPolyfill.forceRegisterDialog; dialogPolyfill["registerDialog"] = dialogPolyfill.registerDialog; if (typeof define === "function" && "amd" in define) define(function () { return dialogPolyfill }); else if (typeof module === "object" && typeof module["exports"] === "object") module["exports"] = dialogPolyfill; else window["dialogPolyfill"] = dialogPolyfill
    })(); (function () {
        var h, aa = "function" == typeof Object.defineProperties ? Object.defineProperty : function (a, b, c) { a != Array.prototype && a != Object.prototype && (a[b] = c.value) }, ba = "undefined" != typeof window && window === this ? this : "undefined" != typeof global && null != global ? global : this; function ca() { ca = function () { }; ba.Symbol || (ba.Symbol = da) } var da = function () { var a = 0; return function (b) { return "jscomp_symbol_" + (b || "") + a++ } }(); function ea() {
            ca(); var a = ba.Symbol.iterator; a || (a = ba.Symbol.iterator = ba.Symbol("iterator")); "function" !=
                typeof Array.prototype[a] && aa(Array.prototype, a, { configurable: !0, writable: !0, value: function () { return fa(this) } }); ea = function () { }
        } function fa(a) { var b = 0; return ha(function () { return b < a.length ? { done: !1, value: a[b++] } : { done: !0 } }) } function ha(a) { ea(); a = { next: a }; a[ba.Symbol.iterator] = function () { return this }; return a } function ia(a) { ea(); var b = a[Symbol.iterator]; return b ? b.call(a) : fa(a) } for (var ja = ba, ka = ["Promise"], la = 0; la < ka.length - 1; la++) { var ma = ka[la]; ma in ja || (ja[ma] = {}); ja = ja[ma] } var na = ka[ka.length -
            1], oa = ja[na], pa = function () {
                function a(a) { this.a = 0; this.h = void 0; this.g = []; var b = this.j(); try { a(b.resolve, b.reject) } catch (k) { b.reject(k) } } function b() { this.a = null } function c(b) { return b instanceof a ? b : new a(function (a) { a(b) }) } if (oa) return oa; b.prototype.g = function (a) { null == this.a && (this.a = [], this.j()); this.a.push(a) }; b.prototype.j = function () { var a = this; this.h(function () { a.u() }) }; var d = ba.setTimeout; b.prototype.h = function (a) { d(a, 0) }; b.prototype.u = function () {
                    for (; this.a && this.a.length;) {
                        var a = this.a;
                        this.a = []; for (var b = 0; b < a.length; ++b) { var c = a[b]; delete a[b]; try { c() } catch (q) { this.i(q) } }
                    } this.a = null
                }; b.prototype.i = function (a) { this.h(function () { throw a; }) }; a.prototype.j = function () { function a(a) { return function (d) { c || (c = !0, a.call(b, d)) } } var b = this, c = !1; return { resolve: a(this.F), reject: a(this.i) } }; a.prototype.F = function (b) {
                    if (b === this) this.i(new TypeError("A Promise cannot resolve to itself")); else if (b instanceof a) this.H(b); else {
                        a: switch (typeof b) {
                            case "object": var c = null != b; break a; case "function": c =
                                !0; break a; default: c = !1
                        }c ? this.D(b) : this.u(b)
                    }
                }; a.prototype.D = function (a) { var b = void 0; try { b = a.then } catch (k) { this.i(k); return } "function" == typeof b ? this.J(b, a) : this.u(a) }; a.prototype.i = function (a) { this.v(2, a) }; a.prototype.u = function (a) { this.v(1, a) }; a.prototype.v = function (a, b) { if (0 != this.a) throw Error("Cannot settle(" + a + ", " + b | "): Promise already settled in state" + this.a); this.a = a; this.h = b; this.A() }; a.prototype.A = function () {
                    if (null != this.g) {
                        for (var a = this.g, b = 0; b < a.length; ++b)a[b].call(), a[b] = null;
                        this.g = null
                    }
                }; var e = new b; a.prototype.H = function (a) { var b = this.j(); a.ya(b.resolve, b.reject) }; a.prototype.J = function (a, b) { var c = this.j(); try { a.call(b, c.resolve, c.reject) } catch (q) { c.reject(q) } }; a.prototype.then = function (b, c) { function d(a, b) { return "function" == typeof a ? function (b) { try { e(a(b)) } catch (Ij) { f(Ij) } } : b } var e, f, g = new a(function (a, b) { e = a; f = b }); this.ya(d(b, e), d(c, f)); return g }; a.prototype.catch = function (a) { return this.then(void 0, a) }; a.prototype.ya = function (a, b) {
                    function c() {
                        switch (d.a) {
                            case 1: a(d.h);
                                break; case 2: b(d.h); break; default: throw Error("Unexpected state: " + d.a);
                        }
                    } var d = this; null == this.g ? e.g(c) : this.g.push(function () { e.g(c) })
                }; a.resolve = c; a.reject = function (b) { return new a(function (a, c) { c(b) }) }; a.race = function (b) { return new a(function (a, d) { for (var e = ia(b), f = e.next(); !f.done; f = e.next())c(f.value).ya(a, d) }) }; a.all = function (b) {
                    var d = ia(b), e = d.next(); return e.done ? c([]) : new a(function (a, b) {
                        function f(b) { return function (c) { g[b] = c; k--; 0 == k && a(g) } } var g = [], k = 0; do g.push(void 0), k++ , c(e.value).ya(f(g.length -
                            1), b), e = d.next(); while (!e.done)
                    })
                }; return a
            }(); pa != oa && null != pa && aa(ja, na, { configurable: !0, writable: !0, value: pa }); var l = this; function qa(a) { return void 0 !== a } function m(a) { return "string" == typeof a } function ra() { } function sa(a) { a.S = void 0; a.Ia = function () { return a.S ? a.S : a.S = new a } } function ta(a) {
                var b = typeof a; if ("object" == b) if (a) {
                    if (a instanceof Array) return "array"; if (a instanceof Object) return b; var c = Object.prototype.toString.call(a); if ("[object Window]" == c) return "object"; if ("[object Array]" == c ||
                        "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) return "array"; if ("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) return "function"
                } else return "null"; else if ("function" == b && "undefined" == typeof a.call) return "object"; return b
            } function ua(a) { return null != a } function va(a) { return "array" == ta(a) } function wa(a) {
                var b = ta(a); return "array" == b || "object" ==
                    b && "number" == typeof a.length
            } function xa(a) { return "function" == ta(a) } function za(a) { var b = typeof a; return "object" == b && null != a || "function" == b } var Aa = "closure_uid_" + (1E9 * Math.random() >>> 0), Ba = 0; function Ca(a, b, c) { return a.call.apply(a.bind, arguments) } function Da(a, b, c) {
                if (!a) throw Error(); if (2 < arguments.length) { var d = Array.prototype.slice.call(arguments, 2); return function () { var c = Array.prototype.slice.call(arguments); Array.prototype.unshift.apply(c, d); return a.apply(b, c) } } return function () {
                    return a.apply(b,
                        arguments)
                }
            } function n(a, b, c) { Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? n = Ca : n = Da; return n.apply(null, arguments) } function Ea(a, b) { var c = Array.prototype.slice.call(arguments, 1); return function () { var b = c.slice(); b.push.apply(b, arguments); return a.apply(this, b) } } function p(a, b) { for (var c in b) a[c] = b[c] } var Fa = Date.now || function () { return +new Date }; function r(a, b) {
                a = a.split("."); var c = l; a[0] in c || !c.execScript || c.execScript("var " + a[0]); for (var d; a.length &&
                    (d = a.shift());)!a.length && qa(b) ? c[d] = b : c[d] && c[d] !== Object.prototype[d] ? c = c[d] : c = c[d] = {}
            } function t(a, b) { function c() { } c.prototype = b.prototype; a.o = b.prototype; a.prototype = new c; a.prototype.constructor = a; a.Mb = function (a, c, f) { for (var d = Array(arguments.length - 2), e = 2; e < arguments.length; e++)d[e - 2] = arguments[e]; return b.prototype[c].apply(a, d) } } function Ga(a) { if (Error.captureStackTrace) Error.captureStackTrace(this, Ga); else { var b = Error().stack; b && (this.stack = b) } a && (this.message = String(a)) } t(Ga, Error); Ga.prototype.name =
                "CustomError"; var Ha; function Ia(a, b) { for (var c = a.split("%s"), d = "", e = Array.prototype.slice.call(arguments, 1); e.length && 1 < c.length;)d += c.shift() + e.shift(); return d + c.join("%s") } var Ja = String.prototype.trim ? function (a) { return a.trim() } : function (a) { return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "") }; function Ka(a) {
                    if (!La.test(a)) return a; -1 != a.indexOf("&") && (a = a.replace(Ma, "&amp;")); -1 != a.indexOf("<") && (a = a.replace(Na, "&lt;")); -1 != a.indexOf(">") && (a = a.replace(Oa, "&gt;")); -1 != a.indexOf('"') && (a = a.replace(Pa,
                        "&quot;")); -1 != a.indexOf("'") && (a = a.replace(Qa, "&#39;")); -1 != a.indexOf("\x00") && (a = a.replace(Ra, "&#0;")); return a
                } var Ma = /&/g, Na = /</g, Oa = />/g, Pa = /"/g, Qa = /'/g, Ra = /\x00/g, La = /[\x00&<>"']/; function Sa(a, b) { return a < b ? -1 : a > b ? 1 : 0 } function Ta(a, b) { b.unshift(a); Ga.call(this, Ia.apply(null, b)); b.shift() } t(Ta, Ga); Ta.prototype.name = "AssertionError"; function Ua(a, b) { throw new Ta("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1)); } var Va = Array.prototype.indexOf ? function (a, b) {
                    return Array.prototype.indexOf.call(a,
                        b, void 0)
                } : function (a, b) { if (m(a)) return m(b) && 1 == b.length ? a.indexOf(b, 0) : -1; for (var c = 0; c < a.length; c++)if (c in a && a[c] === b) return c; return -1 }, Wa = Array.prototype.forEach ? function (a, b, c) { Array.prototype.forEach.call(a, b, c) } : function (a, b, c) { for (var d = a.length, e = m(a) ? a.split("") : a, f = 0; f < d; f++)f in e && b.call(c, e[f], f, a) }; function Xa(a, b) { var c = a.length, d = m(a) ? a.split("") : a; for (--c; 0 <= c; --c)c in d && b.call(void 0, d[c], c, a) } var Ya = Array.prototype.filter ? function (a, b) {
                    return Array.prototype.filter.call(a,
                        b, void 0)
                } : function (a, b) { for (var c = a.length, d = [], e = 0, f = m(a) ? a.split("") : a, g = 0; g < c; g++)if (g in f) { var k = f[g]; b.call(void 0, k, g, a) && (d[e++] = k) } return d }, Za = Array.prototype.map ? function (a, b) { return Array.prototype.map.call(a, b, void 0) } : function (a, b) { for (var c = a.length, d = Array(c), e = m(a) ? a.split("") : a, f = 0; f < c; f++)f in e && (d[f] = b.call(void 0, e[f], f, a)); return d }, $a = Array.prototype.some ? function (a, b) { return Array.prototype.some.call(a, b, void 0) } : function (a, b) {
                    for (var c = a.length, d = m(a) ? a.split("") : a, e = 0; e <
                        c; e++)if (e in d && b.call(void 0, d[e], e, a)) return !0; return !1
                }; function ab(a, b, c) { for (var d = a.length, e = m(a) ? a.split("") : a, f = 0; f < d; f++)if (f in e && b.call(c, e[f], f, a)) return f; return -1 } function bb(a, b) { return 0 <= Va(a, b) } function cb(a, b) { b = Va(a, b); var c; (c = 0 <= b) && db(a, b); return c } function db(a, b) { return 1 == Array.prototype.splice.call(a, b, 1).length } function eb(a, b) { b = ab(a, b, void 0); 0 <= b && db(a, b) } function fb(a, b) { var c = 0; Xa(a, function (d, e) { b.call(void 0, d, e, a) && db(a, e) && c++ }) } function gb(a) {
                    return Array.prototype.concat.apply([],
                        arguments)
                } function hb(a) { var b = a.length; if (0 < b) { for (var c = Array(b), d = 0; d < b; d++)c[d] = a[d]; return c } return [] } var ib; a: { var jb = l.navigator; if (jb) { var kb = jb.userAgent; if (kb) { ib = kb; break a } } ib = "" } function u(a) { return -1 != ib.indexOf(a) } function lb(a, b, c) { for (var d in a) b.call(c, a[d], d, a) } function mb(a) { var b = {}, c; for (c in a) b[c] = a[c]; return b } var nb = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" "); function ob(a, b) {
                    for (var c, d, e = 1; e < arguments.length; e++) {
                        d =
                        arguments[e]; for (c in d) a[c] = d[c]; for (var f = 0; f < nb.length; f++)c = nb[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c])
                    }
                } function pb() { return (u("Chrome") || u("CriOS")) && !u("Edge") } function qb(a) { qb[" "](a); return a } qb[" "] = ra; function rb(a, b) { var c = sb; return Object.prototype.hasOwnProperty.call(c, a) ? c[a] : c[a] = b(a) } var tb = u("Opera"), v = u("Trident") || u("MSIE"), ub = u("Edge"), vb = ub || v, wb = u("Gecko") && !(-1 != ib.toLowerCase().indexOf("webkit") && !u("Edge")) && !(u("Trident") || u("MSIE")) && !u("Edge"), w = -1 !=
                    ib.toLowerCase().indexOf("webkit") && !u("Edge"), xb = w && u("Mobile"), yb = u("Macintosh"); function zb() { var a = l.document; return a ? a.documentMode : void 0 } var Ab; a: {
                        var Bb = "", Cb = function () { var a = ib; if (wb) return /rv:([^\);]+)(\)|;)/.exec(a); if (ub) return /Edge\/([\d\.]+)/.exec(a); if (v) return /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a); if (w) return /WebKit\/(\S+)/.exec(a); if (tb) return /(?:Version)[ \/]?(\S+)/.exec(a) }(); Cb && (Bb = Cb ? Cb[1] : ""); if (v) { var Db = zb(); if (null != Db && Db > parseFloat(Bb)) { Ab = String(Db); break a } } Ab =
                            Bb
                    } var sb = {}; function Eb(a) { return rb(a, function () { for (var b = 0, c = Ja(String(Ab)).split("."), d = Ja(String(a)).split("."), e = Math.max(c.length, d.length), f = 0; 0 == b && f < e; f++) { var g = c[f] || "", k = d[f] || ""; do { g = /(\d*)(\D*)(.*)/.exec(g) || ["", "", "", ""]; k = /(\d*)(\D*)(.*)/.exec(k) || ["", "", "", ""]; if (0 == g[0].length && 0 == k[0].length) break; b = Sa(0 == g[1].length ? 0 : parseInt(g[1], 10), 0 == k[1].length ? 0 : parseInt(k[1], 10)) || Sa(0 == g[2].length, 0 == k[2].length) || Sa(g[2], k[2]); g = g[3]; k = k[3] } while (0 == b) } return 0 <= b }) } var Fb; var Gb = l.document;
        Fb = Gb && v ? zb() || ("CSS1Compat" == Gb.compatMode ? parseInt(Ab, 10) : 5) : void 0; function Hb() { this.a = ""; this.g = Ib } Hb.prototype.ja = !0; Hb.prototype.ha = function () { return this.a }; Hb.prototype.toString = function () { return "Const{" + this.a + "}" }; function Jb(a) { if (a instanceof Hb && a.constructor === Hb && a.g === Ib) return a.a; Ua("expected object of type Const, got '" + a + "'"); return "type_error:Const" } var Ib = {}; function Kb(a) { var b = new Hb; b.a = a; return b } Kb(""); function Lb() { this.a = ""; this.h = Mb } Lb.prototype.ja = !0; Lb.prototype.ha =
            function () { return this.a }; Lb.prototype.g = function () { return 1 }; Lb.prototype.toString = function () { return "TrustedResourceUrl{" + this.a + "}" }; function Nb(a) { if (a instanceof Lb && a.constructor === Lb && a.h === Mb) return a.a; Ua("expected object of type TrustedResourceUrl, got '" + a + "' of type " + ta(a)); return "type_error:TrustedResourceUrl" } var Mb = {}; function Ob(a) { var b = new Lb; b.a = a; return b } function Pb() { this.a = ""; this.h = Qb } Pb.prototype.ja = !0; Pb.prototype.ha = function () { return this.a }; Pb.prototype.g = function () { return 1 };
        Pb.prototype.toString = function () { return "SafeUrl{" + this.a + "}" }; function Rb(a) { if (a instanceof Pb && a.constructor === Pb && a.h === Qb) return a.a; Ua("expected object of type SafeUrl, got '" + a + "' of type " + ta(a)); return "type_error:SafeUrl" } var Sb = /^(?:(?:https?|mailto|ftp):|[^:/?#]*(?:[/?#]|$))/i; function Tb(a) { if (a instanceof Pb) return a; a = a.ja ? a.ha() : String(a); Sb.test(a) || (a = "about:invalid#zClosurez"); return Ub(a) } var Qb = {}; function Ub(a) { var b = new Pb; b.a = a; return b } Ub("about:blank"); function Vb() {
        this.a =
            ""; this.j = Wb; this.h = null
        } Vb.prototype.g = function () { return this.h }; Vb.prototype.ja = !0; Vb.prototype.ha = function () { return this.a }; Vb.prototype.toString = function () { return "SafeHtml{" + this.a + "}" }; function Xb(a) { if (a instanceof Vb && a.constructor === Vb && a.j === Wb) return a.a; Ua("expected object of type SafeHtml, got '" + a + "' of type " + ta(a)); return "type_error:SafeHtml" } var Wb = {}; function Yb(a, b) { var c = new Vb; c.a = a; c.h = b; return c } Yb("<!DOCTYPE html>", 0); Yb("", 0); Yb("<br>", 0); function Zb(a, b) {
        this.a = qa(a) ? a : 0;
            this.g = qa(b) ? b : 0
        } Zb.prototype.toString = function () { return "(" + this.a + ", " + this.g + ")" }; Zb.prototype.ceil = function () { this.a = Math.ceil(this.a); this.g = Math.ceil(this.g); return this }; Zb.prototype.floor = function () { this.a = Math.floor(this.a); this.g = Math.floor(this.g); return this }; Zb.prototype.round = function () { this.a = Math.round(this.a); this.g = Math.round(this.g); return this }; function $b(a, b) { this.width = a; this.height = b } h = $b.prototype; h.toString = function () { return "(" + this.width + " x " + this.height + ")" }; h.aspectRatio =
            function () { return this.width / this.height }; h.ceil = function () { this.width = Math.ceil(this.width); this.height = Math.ceil(this.height); return this }; h.floor = function () { this.width = Math.floor(this.width); this.height = Math.floor(this.height); return this }; h.round = function () { this.width = Math.round(this.width); this.height = Math.round(this.height); return this }; function ac(a) { return a ? new bc(cc(a)) : Ha || (Ha = new bc) } function dc(a, b) {
                var c = b || document; return c.querySelectorAll && c.querySelector ? c.querySelectorAll("." + a) :
                    ec(document, a, b)
            } function fc(a, b) { var c = b || document; if (c.getElementsByClassName) a = c.getElementsByClassName(a)[0]; else { c = document; var d = b || c; a = d.querySelectorAll && d.querySelector && a ? d.querySelector("" + (a ? "." + a : "")) : ec(c, a, b)[0] || null } return a || null } function ec(a, b, c) {
                var d; a = c || a; if (a.querySelectorAll && a.querySelector && b) return a.querySelectorAll("" + (b ? "." + b : "")); if (b && a.getElementsByClassName) { var e = a.getElementsByClassName(b); return e } e = a.getElementsByTagName("*"); if (b) {
                    var f = {}; for (c = d = 0; a = e[c]; c++) {
                        var g =
                            a.className; "function" == typeof g.split && bb(g.split(/\s+/), b) && (f[d++] = a)
                    } f.length = d; return f
                } return e
            } function gc(a, b) { lb(b, function (b, d) { b && b.ja && (b = b.ha()); "style" == d ? a.style.cssText = b : "class" == d ? a.className = b : "for" == d ? a.htmlFor = b : hc.hasOwnProperty(d) ? a.setAttribute(hc[d], b) : 0 == d.lastIndexOf("aria-", 0) || 0 == d.lastIndexOf("data-", 0) ? a.setAttribute(d, b) : a[d] = b }) } var hc = {
                cellpadding: "cellPadding", cellspacing: "cellSpacing", colspan: "colSpan", frameborder: "frameBorder", height: "height", maxlength: "maxLength",
                nonce: "nonce", role: "role", rowspan: "rowSpan", type: "type", usemap: "useMap", valign: "vAlign", width: "width"
            }; function ic(a) { return a.scrollingElement ? a.scrollingElement : w || "CSS1Compat" != a.compatMode ? a.body || a.documentElement : a.documentElement } function jc(a) { a && a.parentNode && a.parentNode.removeChild(a) } function cc(a) { return 9 == a.nodeType ? a : a.ownerDocument || a.document } function kc(a, b) {
                if ("textContent" in a) a.textContent = b; else if (3 == a.nodeType) a.data = String(b); else if (a.firstChild && 3 == a.firstChild.nodeType) {
                    for (; a.lastChild !=
                        a.firstChild;)a.removeChild(a.lastChild); a.firstChild.data = String(b)
                } else { for (var c; c = a.firstChild;)a.removeChild(c); a.appendChild(cc(a).createTextNode(String(b))) }
            } function lc(a, b) { return b ? mc(a, function (a) { return !b || m(a.className) && bb(a.className.split(/\s+/), b) }) : null } function mc(a, b) { for (var c = 0; a;) { if (b(a)) return a; a = a.parentNode; c++ } return null } function bc(a) { this.a = a || l.document || document } bc.prototype.K = function () { return m(void 0) ? this.a.getElementById(void 0) : void 0 }; var nc = "StopIteration" in
                l ? l.StopIteration : { message: "StopIteration", stack: "" }; function oc() { } oc.prototype.next = function () { throw nc; }; oc.prototype.ba = function () { return this }; function pc(a) { if (a instanceof oc) return a; if ("function" == typeof a.ba) return a.ba(!1); if (wa(a)) { var b = 0, c = new oc; c.next = function () { for (; ;) { if (b >= a.length) throw nc; if (b in a) return a[b++]; b++ } }; return c } throw Error("Not implemented"); } function qc(a, b) {
                    if (wa(a)) try { Wa(a, b, void 0) } catch (c) { if (c !== nc) throw c; } else {
                        a = pc(a); try {
                            for (; ;)b.call(void 0, a.next(),
                                void 0, a)
                        } catch (c$1) { if (c$1 !== nc) throw c$1; }
                    }
                } function rc(a) { if (wa(a)) return hb(a); a = pc(a); var b = []; qc(a, function (a) { b.push(a) }); return b } function sc(a, b) { this.g = {}; this.a = []; this.j = this.h = 0; var c = arguments.length; if (1 < c) { if (c % 2) throw Error("Uneven number of arguments"); for (var d = 0; d < c; d += 2)this.set(arguments[d], arguments[d + 1]) } else if (a) { if (a instanceof sc) { var e = a.ga(); d = a.ca() } else { c = []; var f = 0; for (e in a) c[f++] = e; e = c; c = []; f = 0; for (d in a) c[f++] = a[d]; d = c } for (c = 0; c < e.length; c++)this.set(e[c], d[c]) } }
        h = sc.prototype; h.ca = function () { tc(this); for (var a = [], b = 0; b < this.a.length; b++)a.push(this.g[this.a[b]]); return a }; h.ga = function () { tc(this); return this.a.concat() }; h.clear = function () { this.g = {}; this.j = this.h = this.a.length = 0 }; function tc(a) { if (a.h != a.a.length) { for (var b = 0, c = 0; b < a.a.length;) { var d = a.a[b]; uc(a.g, d) && (a.a[c++] = d); b++ } a.a.length = c } if (a.h != a.a.length) { var e = {}; for (c = b = 0; b < a.a.length;)d = a.a[b], uc(e, d) || (a.a[c++] = d, e[d] = 1), b++; a.a.length = c } } h.get = function (a, b) {
            return uc(this.g, a) ? this.g[a] :
                b
        }; h.set = function (a, b) { uc(this.g, a) || (this.h++ , this.a.push(a), this.j++); this.g[a] = b }; h.forEach = function (a, b) { for (var c = this.ga(), d = 0; d < c.length; d++) { var e = c[d], f = this.get(e); a.call(b, f, e, this) } }; h.ba = function (a) { tc(this); var b = 0, c = this.j, d = this, e = new oc; e.next = function () { if (c != d.j) throw Error("The map has changed since the iterator was created"); if (b >= d.a.length) throw nc; var e = d.a[b++]; return a ? e : d.g[e] }; return e }; function uc(a, b) { return Object.prototype.hasOwnProperty.call(a, b) } var vc = /^(?:([^:/?#.]+):)?(?:\/\/(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\?([^#]*))?(?:#([\s\S]*))?$/;
        function wc(a, b) { if (a) { a = a.split("&"); for (var c = 0; c < a.length; c++) { var d = a[c].indexOf("="), e = null; if (0 <= d) { var f = a[c].substring(0, d); e = a[c].substring(d + 1) } else f = a[c]; b(f, e ? decodeURIComponent(e.replace(/\+/g, " ")) : "") } } } function xc(a, b, c, d) { for (var e = c.length; 0 <= (b = a.indexOf(c, b)) && b < d;) { var f = a.charCodeAt(b - 1); if (38 == f || 63 == f) if (f = a.charCodeAt(b + e), !f || 61 == f || 38 == f || 35 == f) return b; b += e + 1 } return -1 } var yc = /#|$/; function zc(a, b) {
            var c = a.search(yc), d = xc(a, 0, b, c); if (0 > d) return null; var e = a.indexOf("&",
                d); if (0 > e || e > c) e = c; d += b.length + 1; return decodeURIComponent(a.substr(d, e - d).replace(/\+/g, " "))
        } var Ac = /[?&]($|#)/; function Bc(a, b) {
        this.g = this.v = this.h = ""; this.A = null; this.j = this.a = ""; this.i = !1; var c; a instanceof Bc ? (this.i = qa(b) ? b : a.i, Cc(this, a.h), this.v = a.v, this.g = a.g, Dc(this, a.A), this.a = a.a, Ec(this, Fc(a.u)), this.j = a.j) : a && (c = String(a).match(vc)) ? (this.i = !!b, Cc(this, c[1] || "", !0), this.v = Gc(c[2] || ""), this.g = Gc(c[3] || "", !0), Dc(this, c[4]), this.a = Gc(c[5] || "", !0), Ec(this, c[6] || "", !0), this.j = Gc(c[7] ||
            "")) : (this.i = !!b, this.u = new Hc(null, this.i))
        } Bc.prototype.toString = function () { var a = [], b = this.h; b && a.push(Ic(b, Jc, !0), ":"); var c = this.g; if (c || "file" == b) a.push("//"), (b = this.v) && a.push(Ic(b, Jc, !0), "@"), a.push(encodeURIComponent(String(c)).replace(/%25([0-9a-fA-F]{2})/g, "%$1")), c = this.A, null != c && a.push(":", String(c)); if (c = this.a) this.g && "/" != c.charAt(0) && a.push("/"), a.push(Ic(c, "/" == c.charAt(0) ? Kc : Lc, !0)); (c = this.u.toString()) && a.push("?", c); (c = this.j) && a.push("#", Ic(c, Mc)); return a.join("") }; Bc.prototype.resolve =
            function (a) {
                var b = new Bc(this), c = !!a.h; c ? Cc(b, a.h) : c = !!a.v; c ? b.v = a.v : c = !!a.g; c ? b.g = a.g : c = null != a.A; var d = a.a; if (c) Dc(b, a.A); else if (c = !!a.a) {
                    if ("/" != d.charAt(0)) if (this.g && !this.a) d = "/" + d; else { var e = b.a.lastIndexOf("/"); -1 != e && (d = b.a.substr(0, e + 1) + d) } e = d; if (".." == e || "." == e) d = ""; else if (-1 != e.indexOf("./") || -1 != e.indexOf("/.")) {
                        d = 0 == e.lastIndexOf("/", 0); e = e.split("/"); for (var f = [], g = 0; g < e.length;) {
                            var k = e[g++]; "." == k ? d && g == e.length && f.push("") : ".." == k ? ((1 < f.length || 1 == f.length && "" != f[0]) && f.pop(),
                                d && g == e.length && f.push("")) : (f.push(k), d = !0)
                        } d = f.join("/")
                    } else d = e
                } c ? b.a = d : c = "" !== a.u.toString(); c ? Ec(b, Fc(a.u)) : c = !!a.j; c && (b.j = a.j); return b
            }; function Cc(a, b, c) { a.h = c ? Gc(b, !0) : b; a.h && (a.h = a.h.replace(/:$/, "")) } function Dc(a, b) { if (b) { b = Number(b); if (isNaN(b) || 0 > b) throw Error("Bad port number " + b); a.A = b } else a.A = null } function Ec(a, b, c) { b instanceof Hc ? (a.u = b, Nc(a.u, a.i)) : (c || (b = Ic(b, Oc)), a.u = new Hc(b, a.i)) } function Pc(a) { return a instanceof Bc ? new Bc(a) : new Bc(a, void 0) } function Qc(a) {
                var b = window.location.href;
                b instanceof Bc || (b = Pc(b)); a instanceof Bc || (a = Pc(a)); return b.resolve(a)
            } function Gc(a, b) { return a ? b ? decodeURI(a.replace(/%25/g, "%2525")) : decodeURIComponent(a) : "" } function Ic(a, b, c) { return m(a) ? (a = encodeURI(a).replace(b, Rc), c && (a = a.replace(/%25([0-9a-fA-F]{2})/g, "%$1")), a) : null } function Rc(a) { a = a.charCodeAt(0); return "%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16) } var Jc = /[#\/\?@]/g, Lc = /[#\?:]/g, Kc = /[#\?]/g, Oc = /[#\?@]/g, Mc = /#/g; function Hc(a, b) { this.g = this.a = null; this.h = a || null; this.j = !!b } function Sc(a) {
            a.a ||
                (a.a = new sc, a.g = 0, a.h && wc(a.h, function (b, c) { a.add(decodeURIComponent(b.replace(/\+/g, " ")), c) }))
            } h = Hc.prototype; h.add = function (a, b) { Sc(this); this.h = null; a = Tc(this, a); var c = this.a.get(a); c || this.a.set(a, c = []); c.push(b); this.g += 1; return this }; function Uc(a, b) { Sc(a); b = Tc(a, b); uc(a.a.g, b) && (a.h = null, a.g -= a.a.get(b).length, a = a.a, uc(a.g, b) && (delete a.g[b], a.h-- , a.j++ , a.a.length > 2 * a.h && tc(a))) } h.clear = function () { this.a = this.h = null; this.g = 0 }; function Vc(a, b) { Sc(a); b = Tc(a, b); return uc(a.a.g, b) } h.forEach = function (a,
                b) { Sc(this); this.a.forEach(function (c, d) { Wa(c, function (c) { a.call(b, c, d, this) }, this) }, this) }; h.ga = function () { Sc(this); for (var a = this.a.ca(), b = this.a.ga(), c = [], d = 0; d < b.length; d++)for (var e = a[d], f = 0; f < e.length; f++)c.push(b[d]); return c }; h.ca = function (a) { Sc(this); var b = []; if (m(a)) Vc(this, a) && (b = gb(b, this.a.get(Tc(this, a)))); else { a = this.a.ca(); for (var c = 0; c < a.length; c++)b = gb(b, a[c]) } return b }; h.set = function (a, b) {
                    Sc(this); this.h = null; a = Tc(this, a); Vc(this, a) && (this.g -= this.a.get(a).length); this.a.set(a,
                        [b]); this.g += 1; return this
                }; h.get = function (a, b) { a = a ? this.ca(a) : []; return 0 < a.length ? String(a[0]) : b }; h.toString = function () { if (this.h) return this.h; if (!this.a) return ""; for (var a = [], b = this.a.ga(), c = 0; c < b.length; c++) { var d = b[c], e = encodeURIComponent(String(d)); d = this.ca(d); for (var f = 0; f < d.length; f++) { var g = e; "" !== d[f] && (g += "=" + encodeURIComponent(String(d[f]))); a.push(g) } } return this.h = a.join("&") }; function Fc(a) { var b = new Hc; b.h = a.h; a.a && (b.a = new sc(a.a), b.g = a.g); return b } function Tc(a, b) {
                    b = String(b);
                    a.j && (b = b.toLowerCase()); return b
                } function Nc(a, b) { b && !a.j && (Sc(a), a.h = null, a.a.forEach(function (a, b) { var c = b.toLowerCase(); b != c && (Uc(this, b), Uc(this, c), 0 < a.length && (this.h = null, this.a.set(Tc(this, c), hb(a)), this.g += a.length)) }, a)); a.j = b } var Wc = { Yb: !0 }, Xc = { $b: !0 }, Yc = { Zb: !0 }; function x() { throw Error("Do not instantiate directly"); } x.prototype.X = null; x.prototype.toString = function () { return this.content }; function Zc(a, b, c, d) {
                    a = a(b || $c, void 0, c); d = (d || ac()).a.createElement("DIV"); a = ad(a); a.match(bd); d.innerHTML =
                        a; 1 == d.childNodes.length && (a = d.firstChild, 1 == a.nodeType && (d = a)); return d
                } function ad(a) { if (!za(a)) return String(a); if (a instanceof x) { if (a.P === Wc) return a.content; if (a.P === Yc) return Ka(a.content) } Ua("Soy template output is unsafe for use as HTML: " + a); return "zSoyz" } var bd = /^<(body|caption|col|colgroup|head|html|tr|td|th|tbody|thead|tfoot)>/i, $c = {}; function cd(a) { if (null != a) switch (a.X) { case 1: return 1; case -1: return -1; case 0: return 0 }return null } function dd() { x.call(this) } t(dd, x); dd.prototype.P = Wc;
        function y(a) { return null != a && a.P === Wc ? a : a instanceof Vb ? z(Xb(a), a.g()) : z(Ka(String(String(a))), cd(a)) } function ed() { x.call(this) } t(ed, x); ed.prototype.P = { Xb: !0 }; ed.prototype.X = 1; function fd() { x.call(this) } t(fd, x); fd.prototype.P = Xc; fd.prototype.X = 1; function gd() { x.call(this) } t(gd, x); gd.prototype.P = { Wb: !0 }; gd.prototype.X = 1; function hd() { x.call(this) } t(hd, x); hd.prototype.P = { Vb: !0 }; hd.prototype.X = 1; function id(a, b) { this.content = String(a); this.X = null != b ? b : null } t(id, x); id.prototype.P = Yc; function jd(a) {
            function b(a) {
            this.content =
                a
            } b.prototype = a.prototype; return function (a) { return new b(String(a)) }
        } function A(a) { return new id(a, void 0) } var z = function (a) { function b(a) { this.content = a } b.prototype = a.prototype; return function (a, d) { a = new b(String(a)); void 0 !== d && (a.X = d); return a } }(dd); jd(ed); var kd = jd(fd); jd(gd); jd(hd); function ld(a) { var b = { label: md("Nouveau mot de passe") }; function c() { } c.prototype = a; a = new c; for (var d in b) a[d] = b[d]; return a } function md(a) { return (a = String(a)) ? new id(a, void 0) : "" } var nd = function (a) {
            function b(a) {
            this.content =
                a
            } b.prototype = a.prototype; return function (a, d) { a = String(a); if (!a) return ""; a = new b(a); void 0 !== d && (a.X = d); return a }
        }(dd); function od(a) { return null != a && a.P === Wc ? String(String(a.content).replace(pd, "").replace(qd, "&lt;")).replace(rd, sd) : Ka(String(a)) } function td(a) { null != a && a.P === Xc ? a = String(a).replace(ud, vd) : a instanceof Pb ? a = String(Rb(a)).replace(ud, vd) : (a = String(a), wd.test(a) ? a = a.replace(ud, vd) : (Ua("Bad value `%s` for |filterNormalizeUri", [a]), a = "#zSoyz")); return a } var xd = {
            "\x00": "&#0;", "\t": "&#9;",
            "\n": "&#10;", "\x0B": "&#11;", "\f": "&#12;", "\r": "&#13;", " ": "&#32;", '"': "&quot;", "&": "&amp;", "'": "&#39;", "-": "&#45;", "/": "&#47;", "<": "&lt;", "=": "&#61;", ">": "&gt;", "`": "&#96;", "\u0085": "&#133;", "\u00a0": "&#160;", "\u2028": "&#8232;", "\u2029": "&#8233;"
        }; function sd(a) { return xd[a] } var yd = {
            "\x00": "%00", "\u0001": "%01", "\u0002": "%02", "\u0003": "%03", "\u0004": "%04", "\u0005": "%05", "\u0006": "%06", "\u0007": "%07", "\b": "%08", "\t": "%09", "\n": "%0A", "\x0B": "%0B", "\f": "%0C", "\r": "%0D", "\u000e": "%0E", "\u000f": "%0F", "\u0010": "%10",
            "\u0011": "%11", "\u0012": "%12", "\u0013": "%13", "\u0014": "%14", "\u0015": "%15", "\u0016": "%16", "\u0017": "%17", "\u0018": "%18", "\u0019": "%19", "\u001a": "%1A", "\u001b": "%1B", "\u001c": "%1C", "\u001d": "%1D", "\u001e": "%1E", "\u001f": "%1F", " ": "%20", '"': "%22", "'": "%27", "(": "%28", ")": "%29", "<": "%3C", ">": "%3E", "\\": "%5C", "{": "%7B", "}": "%7D", "\u007f": "%7F", "\u0085": "%C2%85", "\u00a0": "%C2%A0", "\u2028": "%E2%80%A8", "\u2029": "%E2%80%A9", "\uff01": "%EF%BC%81", "\uff03": "%EF%BC%83", "\uff04": "%EF%BC%84", "\uff06": "%EF%BC%86",
            "\uff07": "%EF%BC%87", "\uff08": "%EF%BC%88", "\uff09": "%EF%BC%89", "\uff0a": "%EF%BC%8A", "\uff0b": "%EF%BC%8B", "\uff0c": "%EF%BC%8C", "\uff0f": "%EF%BC%8F", "\uff1a": "%EF%BC%9A", "\uff1b": "%EF%BC%9B", "\uff1d": "%EF%BC%9D", "\uff1f": "%EF%BC%9F", "\uff20": "%EF%BC%A0", "\uff3b": "%EF%BC%BB", "\uff3d": "%EF%BC%BD"
        }; function vd(a) { return yd[a] } var rd = /[\x00\x22\x27\x3c\x3e]/g, ud = /[\x00- \x22\x27-\x29\x3c\x3e\\\x7b\x7d\x7f\x85\xa0\u2028\u2029\uff01\uff03\uff04\uff06-\uff0c\uff0f\uff1a\uff1b\uff1d\uff1f\uff20\uff3b\uff3d]/g,
            wd = /^(?![^#?]*\/(?:\.|%2E){2}(?:[\/?#]|$))(?:(?:https?|mailto):|[^&:\/?#]*(?:[\/?#]|$))/i, pd = /<(?:!|\/?([a-zA-Z][a-zA-Z0-9:\-]*))(?:[^>'"]|"[^"]*"|'[^']*')*>/g, qd = /</g; function zd() { return A("Saisissez un num\u00e9ro de t\u00e9l\u00e9phone valide") } function Ad() { return A("Code erron\u00e9. Veuillez r\u00e9essayer.") } function Bd() { return A("Saisissez votre mot de passe") } function Cd() { return A("Une erreur s'est produite. Veuillez r\u00e9essayer.") } function Dd() { return A("Votre session de connexion a expir\u00e9. Veuillez r\u00e9essayer.") }
        function Ed() { return A("Cette adresse e-mail existe, mais ne propose aucun mode de connexion. Veuillez r\u00e9initialiser le mot de passe pour r\u00e9cup\u00e9rer le compte.") } function Fd() { return A("Veuillez vous reconnecter pour effectuer cette op\u00e9ration") } function Gd(a, b, c) {
        this.code = Hd + a; if (!(a = b)) {
            a = ""; switch (this.code) {
                case "firebaseui/merge-conflict": a += "\u00c9chec de la mise \u00e0 jour de l'utilisateur anonyme actuel. Les identifiants non anonymes sont d\u00e9j\u00e0 associ\u00e9s \u00e0 un autre compte utilisateur.";
                    break; default: a += Cd()
            }a = A(a).toString()
        } this.message = a || ""; this.credential = c || null
        } t(Gd, Error); Gd.prototype.fa = function () { return { code: this.code, message: this.message } }; Gd.prototype.toJSON = function () { return this.fa() }; var Hd = "firebaseui/"; function Id() { 0 != Jd && (Kd[this[Aa] || (this[Aa] = ++Ba)] = this); this.J = this.J; this.H = this.H } var Jd = 0, Kd = {}; Id.prototype.J = !1; Id.prototype.m = function () { if (!this.J && (this.J = !0, this.l(), 0 != Jd)) { var a = this[Aa] || (this[Aa] = ++Ba); delete Kd[a] } }; function Ld(a, b) {
            a.J ? qa(void 0) ?
                b.call(void 0) : b() : (a.H || (a.H = []), a.H.push(qa(void 0) ? n(b, void 0) : b))
        } Id.prototype.l = function () { if (this.H) for (; this.H.length;)this.H.shift()() }; function Md(a) { a && "function" == typeof a.m && a.m() } var Nd = Object.freeze || function (a) { return a }; var Od = !v || 9 <= Number(Fb), Pd = v && !Eb("9"), Qd = function () { if (!l.addEventListener || !Object.defineProperty) return !1; var a = !1, b = Object.defineProperty({}, "passive", { get: function () { a = !0 } }); l.addEventListener("test", ra, b); l.removeEventListener("test", ra, b); return a }(); function Rd(a,
            b) { this.type = a; this.g = this.target = b; this.h = !1; this.Va = !0 } Rd.prototype.stopPropagation = function () { this.h = !0 }; Rd.prototype.preventDefault = function () { this.Va = !1 }; function B(a, b) {
                Rd.call(this, a ? a.type : ""); this.relatedTarget = this.g = this.target = null; this.button = this.screenY = this.screenX = this.clientY = this.clientX = 0; this.key = ""; this.j = this.keyCode = 0; this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = !1; this.pointerId = 0; this.pointerType = ""; this.a = null; if (a) {
                    var c = this.type = a.type, d = a.changedTouches ? a.changedTouches[0] :
                        null; this.target = a.target || a.srcElement; this.g = b; if (b = a.relatedTarget) { if (wb) { a: { try { qb(b.nodeName); var e = !0; break a } catch (f) { } e = !1 } e || (b = null) } } else "mouseover" == c ? b = a.fromElement : "mouseout" == c && (b = a.toElement); this.relatedTarget = b; null === d ? (this.clientX = void 0 !== a.clientX ? a.clientX : a.pageX, this.clientY = void 0 !== a.clientY ? a.clientY : a.pageY, this.screenX = a.screenX || 0, this.screenY = a.screenY || 0) : (this.clientX = void 0 !== d.clientX ? d.clientX : d.pageX, this.clientY = void 0 !== d.clientY ? d.clientY : d.pageY, this.screenX =
                            d.screenX || 0, this.screenY = d.screenY || 0); this.button = a.button; this.keyCode = a.keyCode || 0; this.key = a.key || ""; this.j = a.charCode || ("keypress" == c ? a.keyCode : 0); this.ctrlKey = a.ctrlKey; this.altKey = a.altKey; this.shiftKey = a.shiftKey; this.metaKey = a.metaKey; this.pointerId = a.pointerId || 0; this.pointerType = m(a.pointerType) ? a.pointerType : Sd[a.pointerType] || ""; this.a = a; a.defaultPrevented && this.preventDefault()
                }
            } t(B, Rd); var Sd = Nd({ 2: "touch", 3: "pen", 4: "mouse" }); B.prototype.stopPropagation = function () {
                B.o.stopPropagation.call(this);
                this.a.stopPropagation ? this.a.stopPropagation() : this.a.cancelBubble = !0
            }; B.prototype.preventDefault = function () { B.o.preventDefault.call(this); var a = this.a; if (a.preventDefault) a.preventDefault(); else if (a.returnValue = !1, Pd) try { if (a.ctrlKey || 112 <= a.keyCode && 123 >= a.keyCode) a.keyCode = -1 } catch (b) { } }; var Td = "closure_listenable_" + (1E6 * Math.random() | 0); function Ud(a) { return !(!a || !a[Td]) } var Vd = 0; function Wd(a, b, c, d, e) {
            this.listener = a; this.a = null; this.src = b; this.type = c; this.capture = !!d; this.Aa = e; this.key = ++Vd;
                this.ka = this.xa = !1
            } function Xd(a) { a.ka = !0; a.listener = null; a.a = null; a.src = null; a.Aa = null } function Yd(a) { this.src = a; this.a = {}; this.g = 0 } Yd.prototype.add = function (a, b, c, d, e) { var f = a.toString(); a = this.a[f]; a || (a = this.a[f] = [], this.g++); var g = Zd(a, b, d, e); -1 < g ? (b = a[g], c || (b.xa = !1)) : (b = new Wd(b, this.src, f, !!d, e), b.xa = c, a.push(b)); return b }; function $d(a, b) { var c = b.type; c in a.a && cb(a.a[c], b) && (Xd(b), 0 == a.a[c].length && (delete a.a[c], a.g--)) } function ae(a, b, c, d, e) {
                a = a.a[b.toString()]; b = -1; a && (b = Zd(a, c, d, e));
                return -1 < b ? a[b] : null
            } function Zd(a, b, c, d) { for (var e = 0; e < a.length; ++e) { var f = a[e]; if (!f.ka && f.listener == b && f.capture == !!c && f.Aa == d) return e } return -1 } var be = "closure_lm_" + (1E6 * Math.random() | 0), ce = {}, de = 0; function ee(a, b, c, d, e) { if (d && d.once) return fe(a, b, c, d, e); if (va(b)) { for (var f = 0; f < b.length; f++)ee(a, b[f], c, d, e); return null } c = ge(c); return Ud(a) ? a.Z(b, c, za(d) ? !!d.capture : !!d, e) : he(a, b, c, !1, d, e) } function he(a, b, c, d, e, f) {
                if (!b) throw Error("Invalid event type"); var g = za(e) ? !!e.capture : !!e, k = ie(a); k || (a[be] =
                    k = new Yd(a)); c = k.add(b, c, d, g, f); if (c.a) return c; d = je(); c.a = d; d.src = a; d.listener = c; if (a.addEventListener) Qd || (e = g), void 0 === e && (e = !1), a.addEventListener(b.toString(), d, e); else if (a.attachEvent) a.attachEvent(ke(b.toString()), d); else if (a.addListener && a.removeListener) a.addListener(d); else throw Error("addEventListener and attachEvent are unavailable."); de++; return c
            } function je() { var a = le, b = Od ? function (c) { return a.call(b.src, b.listener, c) } : function (c) { c = a.call(b.src, b.listener, c); if (!c) return c }; return b }
        function fe(a, b, c, d, e) { if (va(b)) { for (var f = 0; f < b.length; f++)fe(a, b[f], c, d, e); return null } c = ge(c); return Ud(a) ? a.A.add(String(b), c, !0, za(d) ? !!d.capture : !!d, e) : he(a, b, c, !0, d, e) } function me(a, b, c, d, e) { if (va(b)) for (var f = 0; f < b.length; f++)me(a, b[f], c, d, e); else d = za(d) ? !!d.capture : !!d, c = ge(c), Ud(a) ? a.La(b, c, d, e) : a && (a = ie(a)) && (b = ae(a, b, c, d, e)) && ne(b) } function ne(a) {
            if ("number" != typeof a && a && !a.ka) {
                var b = a.src; if (Ud(b)) $d(b.A, a); else {
                    var c = a.type, d = a.a; b.removeEventListener ? b.removeEventListener(c, d, a.capture) :
                        b.detachEvent ? b.detachEvent(ke(c), d) : b.addListener && b.removeListener && b.removeListener(d); de--; (c = ie(b)) ? ($d(c, a), 0 == c.g && (c.src = null, b[be] = null)) : Xd(a)
                }
            }
        } function ke(a) { return a in ce ? ce[a] : ce[a] = "on" + a } function oe(a, b, c, d) { var e = !0; if (a = ie(a)) if (b = a.a[b.toString()]) for (b = b.concat(), a = 0; a < b.length; a++) { var f = b[a]; f && f.capture == c && !f.ka && (f = pe(f, d), e = e && !1 !== f) } return e } function pe(a, b) { var c = a.listener, d = a.Aa || a.src; a.xa && ne(a); return c.call(d, b) } function le(a, b) {
            if (a.ka) return !0; if (!Od) {
                if (!b) a: {
                    b =
                    ["window", "event"]; for (var c = l, d = 0; d < b.length; d++)if (c = c[b[d]], null == c) { b = null; break a } b = c
                } d = b; b = new B(d, this); c = !0; if (!(0 > d.keyCode || void 0 != d.returnValue)) { a: { var e = !1; if (0 == d.keyCode) try { d.keyCode = -1; break a } catch (g) { e = !0 } if (e || void 0 == d.returnValue) d.returnValue = !0 } d = []; for (e = b.g; e; e = e.parentNode)d.push(e); a = a.type; for (e = d.length - 1; !b.h && 0 <= e; e--) { b.g = d[e]; var f = oe(d[e], a, !0, b); c = c && f } for (e = 0; !b.h && e < d.length; e++)b.g = d[e], f = oe(d[e], a, !1, b), c = c && f } return c
            } return pe(a, new B(b, this))
        } function ie(a) {
            a =
            a[be]; return a instanceof Yd ? a : null
        } var qe = "__closure_events_fn_" + (1E9 * Math.random() >>> 0); function ge(a) { if (xa(a)) return a; a[qe] || (a[qe] = function (b) { return a.handleEvent(b) }); return a[qe] } function C() { Id.call(this); this.A = new Yd(this); this.Za = this; this.ta = null } t(C, Id); C.prototype[Td] = !0; h = C.prototype; h.Ka = function (a) { this.ta = a }; h.removeEventListener = function (a, b, c, d) { me(this, a, b, c, d) }; function re(a, b) {
            var c, d = a.ta; if (d) for (c = []; d; d = d.ta)c.push(d); a = a.Za; d = b.type || b; if (m(b)) b = new Rd(b, a); else if (b instanceof
                Rd) b.target = b.target || a; else { var e = b; b = new Rd(d, a); ob(b, e) } e = !0; if (c) for (var f = c.length - 1; !b.h && 0 <= f; f--) { var g = b.g = c[f]; e = se(g, d, !0, b) && e } b.h || (g = b.g = a, e = se(g, d, !0, b) && e, b.h || (e = se(g, d, !1, b) && e)); if (c) for (f = 0; !b.h && f < c.length; f++)g = b.g = c[f], e = se(g, d, !1, b) && e; return e
        } h.l = function () { C.o.l.call(this); if (this.A) { var a = this.A, b = 0, c; for (c in a.a) { for (var d = a.a[c], e = 0; e < d.length; e++)++b, Xd(d[e]); delete a.a[c]; a.g-- } } this.ta = null }; h.Z = function (a, b, c, d) { return this.A.add(String(a), b, !1, c, d) }; h.La = function (a,
            b, c, d) { var e = this.A; a = String(a).toString(); if (a in e.a) { var f = e.a[a]; b = Zd(f, b, c, d); -1 < b && (Xd(f[b]), db(f, b), 0 == f.length && (delete e.a[a], e.g--)) } }; function se(a, b, c, d) { b = a.A.a[String(b)]; if (!b) return !0; b = b.concat(); for (var e = !0, f = 0; f < b.length; ++f) { var g = b[f]; if (g && !g.ka && g.capture == c) { var k = g.listener, q = g.Aa || g.src; g.xa && $d(a.A, g); e = !1 !== k.call(q, d) && e } } return e && 0 != d.Va } var te = {}, ue = 0; function ve(a, b) {
                if (!a) throw Error("Event target element must be provided!"); a = we(a); if (te[a] && te[a].length) for (var c =
                    0; c < te[a].length; c++)re(te[a][c], b)
            } function xe(a) { var b = we(a.K()); te[b] ? bb(te[b], a) || te[b].push(a) : te[b] = [a] } function ye(a) { var b = we(a.K()); te[b] && te[b].length && (eb(te[b], function (b) { return b == a }), te[b].length || delete te[b]) } function we(a) { "undefined" === typeof a.a && (a.a = ue, ue++); return a.a } function ze(a) { if (!a) throw Error("Event target element must be provided!"); this.a = a; C.call(this) } t(ze, C); ze.prototype.K = function () { return this.a }; function Ae(a) {
                a.prototype.then = a.prototype.then; a.prototype.$goog_Thenable =
                    !0
            } function Be(a) { if (!a) return !1; try { return !!a.$goog_Thenable } catch (b) { return !1 } } function Ce(a, b) { this.h = a; this.j = b; this.g = 0; this.a = null } Ce.prototype.get = function () { if (0 < this.g) { this.g--; var a = this.a; this.a = a.next; a.next = null } else a = this.h(); return a }; function De(a, b) { a.j(b); 100 > a.g && (a.g++ , b.next = a.a, a.a = b) } function Ee() { this.g = this.a = null } var Ge = new Ce(function () { return new Fe }, function (a) { a.reset() }); Ee.prototype.add = function (a, b) {
                var c = Ge.get(); c.set(a, b); this.g ? this.g.next = c : this.a = c; this.g =
                    c
            }; function He() { var a = Ie, b = null; a.a && (b = a.a, a.a = a.a.next, a.a || (a.g = null), b.next = null); return b } function Fe() { this.next = this.g = this.a = null } Fe.prototype.set = function (a, b) { this.a = a; this.g = b; this.next = null }; Fe.prototype.reset = function () { this.next = this.g = this.a = null }; function Je(a) { l.setTimeout(function () { throw a; }, 0) } var Ke; function Le() {
                var a = l.MessageChannel; "undefined" === typeof a && "undefined" !== typeof window && window.postMessage && window.addEventListener && !u("Presto") && (a = function () {
                    var a = document.createElement("IFRAME");
                    a.style.display = "none"; a.src = ""; document.documentElement.appendChild(a); var b = a.contentWindow; a = b.document; a.open(); a.write(""); a.close(); var c = "callImmediate" + Math.random(), d = "file:" == b.location.protocol ? "*" : b.location.protocol + "//" + b.location.host; a = n(function (a) { if (("*" == d || a.origin == d) && a.data == c) this.port1.onmessage() }, this); b.addEventListener("message", a, !1); this.port1 = {}; this.port2 = { postMessage: function () { b.postMessage(c, d) } }
                }); if ("undefined" !== typeof a && !u("Trident") && !u("MSIE")) {
                    var b = new a,
                    c = {}, d = c; b.port1.onmessage = function () { if (qa(c.next)) { c = c.next; var a = c.Sa; c.Sa = null; a() } }; return function (a) { d.next = { Sa: a }; d = d.next; b.port2.postMessage(0) }
                } return "undefined" !== typeof document && "onreadystatechange" in document.createElement("SCRIPT") ? function (a) { var b = document.createElement("SCRIPT"); b.onreadystatechange = function () { b.onreadystatechange = null; b.parentNode.removeChild(b); b = null; a(); a = null }; document.documentElement.appendChild(b) } : function (a) { l.setTimeout(a, 0) }
            } function Me(a, b) {
                Ne || Oe();
                Pe || (Ne(), Pe = !0); Ie.add(a, b)
            } var Ne; function Oe() { if (-1 != String(l.Promise).indexOf("[native code]")) { var a = l.Promise.resolve(void 0); Ne = function () { a.then(Qe) } } else Ne = function () { var a = Qe; !xa(l.setImmediate) || l.Window && l.Window.prototype && !u("Edge") && l.Window.prototype.setImmediate == l.setImmediate ? (Ke || (Ke = Le()), Ke(a)) : l.setImmediate(a) } } var Pe = !1, Ie = new Ee; function Qe() { for (var a; a = He();) { try { a.a.call(a.g) } catch (b) { Je(b) } De(Ge, a) } Pe = !1 } function D(a, b) {
            this.a = Re; this.v = void 0; this.j = this.g = this.h =
                null; this.i = this.u = !1; if (a != ra) try { var c = this; a.call(b, function (a) { Se(c, Te, a) }, function (a) { if (!(a instanceof Ue)) try { if (a instanceof Error) throw a; throw Error("Promise rejected."); } catch (e) { } Se(c, Ve, a) }) } catch (d) { Se(this, Ve, d) }
            } var Re = 0, Te = 2, Ve = 3; function We() { this.next = this.context = this.g = this.h = this.a = null; this.j = !1 } We.prototype.reset = function () { this.context = this.g = this.h = this.a = null; this.j = !1 }; var Xe = new Ce(function () { return new We }, function (a) { a.reset() }); function Ye(a, b, c) {
                var d = Xe.get(); d.h =
                    a; d.g = b; d.context = c; return d
            } function E(a) { if (a instanceof D) return a; var b = new D(ra); Se(b, Te, a); return b } function Ze(a) { return new D(function (b, c) { c(a) }) } D.prototype.then = function (a, b, c) { return $e(this, xa(a) ? a : null, xa(b) ? b : null, c) }; Ae(D); function af(a, b) { return $e(a, null, b, void 0) } D.prototype.cancel = function (a) { this.a == Re && Me(function () { var b = new Ue(a); bf(this, b) }, this) }; function bf(a, b) {
                if (a.a == Re) if (a.h) {
                    var c = a.h; if (c.g) {
                        for (var d = 0, e = null, f = null, g = c.g; g && (g.j || (d++ , g.a == a && (e = g), !(e && 1 < d))); g =
                            g.next)e || (f = g); e && (c.a == Re && 1 == d ? bf(c, b) : (f ? (d = f, d.next == c.j && (c.j = d), d.next = d.next.next) : cf(c), df(c, e, Ve, b)))
                    } a.h = null
                } else Se(a, Ve, b)
            } function ef(a, b) { a.g || a.a != Te && a.a != Ve || ff(a); a.j ? a.j.next = b : a.g = b; a.j = b } function $e(a, b, c, d) { var e = Ye(null, null, null); e.a = new D(function (a, g) { e.h = b ? function (c) { try { var e = b.call(d, c); a(e) } catch (O) { g(O) } } : a; e.g = c ? function (b) { try { var e = c.call(d, b); !qa(e) && b instanceof Ue ? g(b) : a(e) } catch (O) { g(O) } } : g }); e.a.h = a; ef(a, e); return e.a } D.prototype.D = function (a) {
            this.a = Re; Se(this,
                Te, a)
            }; D.prototype.F = function (a) { this.a = Re; Se(this, Ve, a) }; function Se(a, b, c) { if (a.a == Re) { a === c && (b = Ve, c = new TypeError("Promise cannot resolve to itself")); a.a = 1; a: { var d = c, e = a.D, f = a.F; if (d instanceof D) { ef(d, Ye(e || ra, f || null, a)); var g = !0 } else if (Be(d)) d.then(e, f, a), g = !0; else { if (za(d)) try { var k = d.then; if (xa(k)) { gf(d, k, e, f, a); g = !0; break a } } catch (q) { f.call(a, q); g = !0; break a } g = !1 } } g || (a.v = c, a.a = b, a.h = null, ff(a), b != Ve || c instanceof Ue || hf(a, c)) } } function gf(a, b, c, d, e) {
                function f(a) { k || (k = !0, d.call(e, a)) }
                function g(a) { k || (k = !0, c.call(e, a)) } var k = !1; try { b.call(a, g, f) } catch (q) { f(q) }
            } function ff(a) { a.u || (a.u = !0, Me(a.A, a)) } function cf(a) { var b = null; a.g && (b = a.g, a.g = b.next, b.next = null); a.g || (a.j = null); return b } D.prototype.A = function () { for (var a; a = cf(this);)df(this, a, this.a, this.v); this.u = !1 }; function df(a, b, c, d) { if (c == Ve && b.g && !b.j) for (; a && a.i; a = a.h)a.i = !1; if (b.a) b.a.h = null, jf(b, c, d); else try { b.j ? b.h.call(b.context) : jf(b, c, d) } catch (e) { kf.call(null, e) } De(Xe, b) } function jf(a, b, c) {
                b == Te ? a.h.call(a.context,
                    c) : a.g && a.g.call(a.context, c)
            } function hf(a, b) { a.i = !0; Me(function () { a.i && kf.call(null, b) }) } var kf = Je; function Ue(a) { Ga.call(this, a) } t(Ue, Ga); Ue.prototype.name = "cancel"; function lf(a) { window.location.assign(Rb(Tb(a))) } function mf() { try { return !!(window.opener && window.opener.location && window.opener.location.assign && window.opener.location.hostname === window.location.hostname && window.opener.location.protocol === window.location.protocol) } catch (a) { } return !1 } function nf(a) {
                a = za(a) && 1 == a.nodeType ? a : document.querySelector(String(a));
                if (null == a) throw Error("Could not find the FirebaseUI widget element on the page."); return a
            } function of() { var a = null; return af(new D(function (b) { "complete" == l.document.readyState ? b() : (a = function () { b() }, fe(window, "load", a)) }), function (b) { me(window, "load", a); throw b; }) } function pf(a, b) { this.i = []; this.J = a; this.H = b || null; this.j = this.a = !1; this.h = void 0; this.D = this.s = this.v = !1; this.u = 0; this.g = null; this.A = 0 } pf.prototype.cancel = function (a) {
                if (this.a) this.h instanceof pf && this.h.cancel(); else {
                    if (this.g) {
                        var b =
                            this.g; delete this.g; a ? b.cancel(a) : (b.A-- , 0 >= b.A && b.cancel())
                    } this.J ? this.J.call(this.H, this) : this.D = !0; this.a || (a = new qf(this), rf(this), sf(this, !1, a))
                }
            }; pf.prototype.F = function (a, b) { this.v = !1; sf(this, a, b) }; function sf(a, b, c) { a.a = !0; a.h = c; a.j = !b; tf(a) } function rf(a) { if (a.a) { if (!a.D) throw new uf(a); a.D = !1 } } function vf(a, b, c) { a.i.push([b, c, void 0]); a.a && tf(a) } pf.prototype.then = function (a, b, c) {
                var d, e, f = new D(function (a, b) { d = a; e = b }); vf(this, d, function (a) { a instanceof qf ? f.cancel() : e(a) }); return f.then(a,
                    b, c)
            }; Ae(pf); function wf(a) { return $a(a.i, function (a) { return xa(a[1]) }) } function tf(a) {
                if (a.u && a.a && wf(a)) { var b = a.u, c = xf[b]; c && (l.clearTimeout(c.a), delete xf[b]); a.u = 0 } a.g && (a.g.A-- , delete a.g); b = a.h; for (var d = c = !1; a.i.length && !a.v;) { var e = a.i.shift(), f = e[0], g = e[1]; e = e[2]; if (f = a.j ? g : f) try { var k = f.call(e || a.H, b); qa(k) && (a.j = a.j && (k == b || k instanceof Error), a.h = b = k); if (Be(b) || "function" === typeof l.Promise && b instanceof l.Promise) d = !0, a.v = !0 } catch (q) { b = q, a.j = !0, wf(a) || (c = !0) } } a.h = b; d && (k = n(a.F, a, !0),
                    d = n(a.F, a, !1), b instanceof pf ? (vf(b, k, d), b.s = !0) : b.then(k, d)); c && (b = new yf(b), xf[b.a] = b, a.u = b.a)
            } function uf() { Ga.call(this) } t(uf, Ga); uf.prototype.message = "Deferred has already fired"; uf.prototype.name = "AlreadyCalledError"; function qf() { Ga.call(this) } t(qf, Ga); qf.prototype.message = "Deferred was canceled"; qf.prototype.name = "CanceledError"; function yf(a) { this.a = l.setTimeout(n(this.h, this), 0); this.g = a } yf.prototype.h = function () { delete xf[this.a]; throw this.g; }; var xf = {}; function zf(a) {
                var b = {}, c = b.document ||
                    document, d = Nb(a), e = document.createElement("SCRIPT"), f = { Wa: e, Xa: void 0 }, g = new pf(Af, f), k = null, q = null != b.timeout ? b.timeout : 5E3; 0 < q && (k = window.setTimeout(function () { Bf(e, !0); var a = new Cf(Df, "Timeout reached for loading script " + d); rf(g); sf(g, !1, a) }, q), f.Xa = k); e.onload = e.onreadystatechange = function () { e.readyState && "loaded" != e.readyState && "complete" != e.readyState || (Bf(e, b.Pb || !1, k), rf(g), sf(g, !0, null)) }; e.onerror = function () { Bf(e, !0, k); var a = new Cf(Ef, "Error while loading script " + d); rf(g); sf(g, !1, a) };
                f = b.attributes || {}; ob(f, { type: "text/javascript", charset: "UTF-8" }); gc(e, f); e.src = Nb(a); Ff(c).appendChild(e); return g
            } function Ff(a) { var b = (a || document).getElementsByTagName("HEAD"); return b && 0 != b.length ? b[0] : a.documentElement } function Af() { if (this && this.Wa) { var a = this.Wa; a && "SCRIPT" == a.tagName && Bf(a, !0, this.Xa) } } function Bf(a, b, c) { null != c && l.clearTimeout(c); a.onload = ra; a.onerror = ra; a.onreadystatechange = ra; b && window.setTimeout(function () { jc(a) }, 0) } var Ef = 0, Df = 1; function Cf(a, b) {
                var c = "Jsloader error (code #" +
                    a + ")"; b && (c += ": " + b); Ga.call(this, c); this.code = a
            } t(Cf, Ga); function Gf(a) { this.a = a || l.googleyolo; this.g = null; this.h = !1 } sa(Gf); var Hf = Kb("https://smartlock.google.com/client"); Gf.prototype.cancel = function () { this.a && this.h && (this.g = this.a.cancelLastOperation().catch(function () { })) }; function If(a, b, c) {
                if (a.a && b) {
                    var d = function () {
                    a.h = !0; var d = Promise.resolve(null); c || (d = a.a.retrieve(b).catch(function (a) { if ("userCanceled" === a.type || "illegalConcurrentRequest" === a.type) throw a; return null })); return d.then(function (c) {
                        return c ?
                            c : a.a.hint(b)
                    }).catch(function (d) { if ("userCanceled" === d.type) a.g = Promise.resolve(); else if ("illegalConcurrentRequest" === d.type) return a.cancel(), If(a, b, c); return null })
                    }; return a.g ? a.g.then(d) : d()
                } if (b) return d = af(Jf.Ia().load().then(function () { a.a = l.googleyolo; return If(a, b, c) }), function () { return null }), Promise.resolve(d); if ("undefined" !== typeof Promise) return Promise.resolve(null); throw Error("One-Tap sign in not supported in the current browser!");
            } function Jf() { this.a = null } sa(Jf); Jf.prototype.load =
                function () { var a = this; if (this.a) return this.a; var b = Ob(Jb(Hf)); return l.googleyolo ? E() : this.a = of().then(function () { if (!l.googleyolo) return new D(function (c, d) { var e = setTimeout(function () { a.a = null; d(Error("Network error!")) }, 1E4); l.onGoogleYoloLoad = function () { clearTimeout(e); c() }; af(E(zf(b)), function (b) { clearTimeout(e); a.a = null; d(b) }) }) }) }; function Kf(a, b) { this.a = a; this.g = b || function (a) { throw a; } } Kf.prototype.confirm = function (a) { return af(E(this.a.confirm(a)), this.g) }; function Lf(a, b, c) {
                    this.reset(a,
                        b, c, void 0, void 0)
                } Lf.prototype.a = null; var Mf = 0; Lf.prototype.reset = function (a, b, c, d, e) { "number" == typeof e || Mf++; this.h = d || Fa(); this.j = a; this.i = b; this.g = c; delete this.a }; function Nf(a) { this.i = a; this.a = this.h = this.j = this.g = null } function Of(a, b) { this.name = a; this.value = b } Of.prototype.toString = function () { return this.name }; var Pf = new Of("SHOUT", 1200), Qf = new Of("SEVERE", 1E3), Rf = new Of("WARNING", 900), Sf = new Of("CONFIG", 700); function Tf(a) {
                    if (a.j) return a.j; if (a.g) return Tf(a.g); Ua("Root logger has no level set.");
                    return null
                } Nf.prototype.log = function (a, b, c) { if (a.value >= Tf(this).value) for (xa(b) && (b = b()), a = new Lf(a, String(b), this.i), c && (a.a = c), c = this; c;) { var d = c, e = a; if (d.a) for (var f = 0; b = d.a[f]; f++)b(e); c = c.g } }; function Uf(a) { Vf.log(Rf, a, void 0) } var Wf = {}, Xf = null; function Yf() { Xf || (Xf = new Nf(""), Wf[""] = Xf, Xf.j = Sf) } function Zf(a) { Yf(); var b; if (!(b = Wf[a])) { b = new Nf(a); var c = a.lastIndexOf("."), d = a.substr(c + 1); c = Zf(a.substr(0, c)); c.h || (c.h = {}); c.h[d] = b; b.g = c; Wf[a] = b } return b } function $f() { this.a = Fa() } var ag = null;
        $f.prototype.set = function (a) { this.a = a }; $f.prototype.reset = function () { this.set(Fa()) }; $f.prototype.get = function () { return this.a }; function bg(a) { this.j = a || ""; ag || (ag = new $f); this.i = ag } bg.prototype.a = !0; bg.prototype.g = !0; bg.prototype.h = !1; function cg(a) { return 10 > a ? "0" + a : String(a) } function dg(a, b) { a = (a.h - b) / 1E3; b = a.toFixed(3); var c = 0; if (1 > a) c = 2; else for (; 100 > a;)c++ , a *= 10; for (; 0 < c--;)b = " " + b; return b } function eg(a) { bg.call(this, a) } t(eg, bg); function fg() {
        this.i = n(this.h, this); this.a = new eg; this.a.g = !1;
            this.a.h = !1; this.g = this.a.a = !1; this.j = {}
        } fg.prototype.h = function (a) {
            if (!this.j[a.g]) {
                var b = this.a; var c = []; c.push(b.j, " "); if (b.g) { var d = new Date(a.h); c.push("[", cg(d.getFullYear() - 2E3) + cg(d.getMonth() + 1) + cg(d.getDate()) + " " + cg(d.getHours()) + ":" + cg(d.getMinutes()) + ":" + cg(d.getSeconds()) + "." + cg(Math.floor(d.getMilliseconds() / 10)), "] ") } c.push("[", dg(a, b.i.get()), "s] "); c.push("[", a.g, "] "); c.push(a.i); b.h && (d = a.a) && c.push("\n", d instanceof Error ? d.message : d.toString()); b.a && c.push("\n"); b = c.join("");
                if (c = gg) switch (a.j) { case Pf: hg(c, "info", b); break; case Qf: hg(c, "error", b); break; case Rf: hg(c, "warn", b); break; default: hg(c, "log", b) }
            }
        }; var gg = l.console; function hg(a, b, c) { if (a[b]) a[b](c); else a.log(c) } var Vf; Vf = Zf("firebaseui"); var ig = new fg; if (1 != ig.g) { var jg; Yf(); jg = Xf; var kg = ig.i; jg.a || (jg.a = []); jg.a.push(kg); ig.g = !0 } function lg(a) { Vf && Vf.log(Qf, a, void 0) } function mg(a, b, c, d) { this.a = a; this.h = b || null; this.j = c || null; this.g = d || null } mg.prototype.fa = function () {
            return {
                email: this.a, displayName: this.h, photoUrl: this.j,
                providerId: this.g
            }
        }; function ng(a) { return a.email ? new mg(a.email, a.displayName, a.photoUrl, a.providerId) : null } var og = { "facebook.com": "FacebookAuthProvider", "github.com": "GithubAuthProvider", "google.com": "GoogleAuthProvider", password: "EmailAuthProvider", "twitter.com": "TwitterAuthProvider", phone: "PhoneAuthProvider" }; function pg(a, b) { this.g = a; this.a = b || null } pg.prototype.fa = function () { return { email: this.g, credential: this.a && mb(this.a) } }; function qg(a) {
            if (a && a.email) {
                var b; if (b = a.credential) {
                    var c = (b = a.credential) &&
                        b.providerId; b = og[c] && firebase.auth[og[c]] ? b.secret && b.accessToken ? firebase.auth[og[c]].credential(b.accessToken, b.secret) : c == firebase.auth.GoogleAuthProvider.PROVIDER_ID ? firebase.auth[og[c]].credential(b.idToken, b.accessToken) : firebase.auth[og[c]].credential(b.accessToken) : null
                } return new pg(a.email, b)
            } return null
        } function rg(a) { var b = []; sg(new tg, a, b); return b.join("") } function tg() { } function sg(a, b, c) {
            if (null == b) c.push("null"); else {
                if ("object" == typeof b) {
                    if (va(b)) {
                        var d = b; b = d.length; c.push("[");
                        for (var e = "", f = 0; f < b; f++)c.push(e), sg(a, d[f], c), e = ","; c.push("]"); return
                    } if (b instanceof String || b instanceof Number || b instanceof Boolean) b = b.valueOf(); else { c.push("{"); e = ""; for (d in b) Object.prototype.hasOwnProperty.call(b, d) && (f = b[d], "function" != typeof f && (c.push(e), ug(d, c), c.push(":"), sg(a, f, c), e = ",")); c.push("}"); return }
                } switch (typeof b) {
                    case "string": ug(b, c); break; case "number": c.push(isFinite(b) && !isNaN(b) ? String(b) : "null"); break; case "boolean": c.push(String(b)); break; case "function": c.push("null");
                        break; default: throw Error("Unknown type: " + typeof b);
                }
            }
        } var vg = { '"': '\\"', "\\": "\\\\", "/": "\\/", "\b": "\\b", "\f": "\\f", "\n": "\\n", "\r": "\\r", "\t": "\\t", "\x0B": "\\u000b" }, wg = /\uffff/.test("\uffff") ? /[\\"\x00-\x1f\x7f-\uffff]/g : /[\\"\x00-\x1f\x7f-\xff]/g; function ug(a, b) { b.push('"', a.replace(wg, function (a) { var b = vg[a]; b || (b = "\\u" + (a.charCodeAt(0) | 65536).toString(16).substr(1), vg[a] = b); return b }), '"') } function xg(a) { this.a = a } xg.prototype.set = function (a, b) { qa(b) ? this.a.set(a, rg(b)) : this.a.ma(a) }; xg.prototype.get =
            function (a) { try { var b = this.a.get(a) } catch (c) { return } if (null !== b) try { return JSON.parse(b) } catch (c$2) { throw "Storage: Invalid value was encountered"; } }; function yg() { } function zg() { } t(zg, yg); zg.prototype.clear = function () { var a = rc(this.ba(!0)), b = this; Wa(a, function (a) { b.ma(a) }) }; function Ag(a) { this.a = a } t(Ag, zg); function Bg(a) { if (!a.a) return !1; try { return a.a.setItem("__sak", "1"), a.a.removeItem("__sak"), !0 } catch (b) { return !1 } } h = Ag.prototype; h.set = function (a, b) {
                try { this.a.setItem(a, b) } catch (c) {
                    if (0 == this.a.length) throw "Storage mechanism: Storage disabled";
                    throw "Storage mechanism: Quota exceeded";
                }
            }; h.get = function (a) { a = this.a.getItem(a); if (!m(a) && null !== a) throw "Storage mechanism: Invalid value was encountered"; return a }; h.ma = function (a) { this.a.removeItem(a) }; h.ba = function (a) { var b = 0, c = this.a, d = new oc; d.next = function () { if (b >= c.length) throw nc; var d = c.key(b++); if (a) return d; d = c.getItem(d); if (!m(d)) throw "Storage mechanism: Invalid value was encountered"; return d }; return d }; h.clear = function () { this.a.clear() }; h.key = function (a) { return this.a.key(a) }; function Cg() {
                var a =
                    null; try { a = window.localStorage || null } catch (b) { } this.a = a
            } t(Cg, Ag); function Dg() { var a = null; try { a = window.sessionStorage || null } catch (b) { } this.a = a } t(Dg, Ag); function Eg(a, b) { this.g = a; this.a = b + "::" } t(Eg, zg); Eg.prototype.set = function (a, b) { this.g.set(this.a + a, b) }; Eg.prototype.get = function (a) { return this.g.get(this.a + a) }; Eg.prototype.ma = function (a) { this.g.ma(this.a + a) }; Eg.prototype.ba = function (a) {
                var b = this.g.ba(!0), c = this, d = new oc; d.next = function () {
                    for (var d = b.next(); d.substr(0, c.a.length) != c.a;)d = b.next();
                    return a ? d.substr(c.a.length) : c.g.get(d)
                }; return d
            }; var Fg, Gg = new Cg; Fg = Bg(Gg) ? new Eg(Gg, "firebaseui") : null; var Hg = new xg(Fg), Ig, Jg = new Dg; Ig = Bg(Jg) ? new Eg(Jg, "firebaseui") : null; var Kg = new xg(Ig), Lg = { name: "pendingEmailCredential", ea: !1 }, Mg = { name: "pendingRedirect", ea: !1 }, Ng = { name: "redirectUrl", ea: !1 }, Og = { name: "rememberAccount", ea: !1 }, Pg = { name: "rememberedAccounts", ea: !0 }; function Qg(a, b) { return (a.ea ? Hg : Kg).get(b ? a.name + ":" + b : a.name) } function F(a, b) { (a.ea ? Hg : Kg).a.ma(b ? a.name + ":" + b : a.name) } function Rg(a,
                b, c) { (a.ea ? Hg : Kg).set(c ? a.name + ":" + c : a.name, b) } function Sg(a) { return Qg(Ng, a) || null } function Tg(a, b) { Rg(Ng, a, b) } function Ug(a, b) { Rg(Og, a, b) } function Vg(a) { a = Qg(Pg, a) || []; a = Za(a, function (a) { return ng(a) }); return Ya(a, ua) } function Wg(a, b) { var c = Vg(b), d = ab(c, function (b) { return b.a == a.a && (b.g || null) == (a.g || null) }); -1 < d && db(c, d); c.unshift(a); Rg(Pg, Za(c, function (a) { return a.fa() }), b) } function Xg(a) { a = Qg(Lg, a) || null; return qg(a) } function Yg(a) { Rg(Mg, "pending", a) } function Zg() { this.S = {} } function $g(a, b, c) {
                    if (b.toLowerCase() in
                        a.S) throw Error("Configuration " + b + " has already been defined."); a.S[b.toLowerCase()] = c
                } function ah(a, b, c) { if (!(b.toLowerCase() in a.S)) throw Error("Configuration " + b + " is not defined."); a.S[b.toLowerCase()] = c } Zg.prototype.get = function (a) { if (!(a.toLowerCase() in this.S)) throw Error("Configuration " + a + " is not defined."); return this.S[a.toLowerCase()] }; function bh(a, b) { a = a.get(b); if (!a) throw Error("Configuration " + b + " is required."); return a } function ch() { this.g = void 0; this.a = {} } h = ch.prototype; h.set =
                    function (a, b) { dh(this, a, b, !1) }; h.add = function (a, b) { dh(this, a, b, !0) }; function dh(a, b, c, d) { for (var e = 0; e < b.length; e++) { var f = b.charAt(e); a.a[f] || (a.a[f] = new ch); a = a.a[f] } if (d && void 0 !== a.g) throw Error('The collection already contains the key "' + b + '"'); a.g = c } h.get = function (a) { a: { for (var b = this, c = 0; c < a.length; c++)if (b = b.a[a.charAt(c)], !b) { a = void 0; break a } a = b } return a ? a.g : void 0 }; h.ca = function () { var a = []; eh(this, a); return a }; function eh(a, b) { void 0 !== a.g && b.push(a.g); for (var c in a.a) eh(a.a[c], b) } h.ga =
                        function () { var a = []; fh(this, "", a); return a }; function fh(a, b, c) { void 0 !== a.g && c.push(b); for (var d in a.a) fh(a.a[d], b + d, c) } h.clear = function () { this.a = {}; this.g = void 0 }; function gh(a) { var b = hh.g, c = {}, d = 0; void 0 !== b.g && (c[d] = b.g); for (; d < a.length; d++) { var e = a.charAt(d); if (!(e in b.a)) break; b = b.a[e]; void 0 !== b.g && (c[d] = b.g) } for (var f in c) if (c.hasOwnProperty(f)) return c[f]; return [] } function ih(a) { for (var b = 0; b < jh.length; b++)if (jh[b].c === a) return jh[b]; return null } var jh = [{
                            name: "Afghanistan", c: "93-AF-0",
                            b: "93", f: "AF"
                        }, { name: "\u00c5land (\u00celes)", c: "358-AX-0", b: "358", f: "AX" }, { name: "Albanie", c: "355-AL-0", b: "355", f: "AL" }, { name: "Alg\u00e9rie", c: "213-DZ-0", b: "213", f: "DZ" }, { name: "Samoa am\u00e9ricaines", c: "1-AS-0", b: "1", f: "AS" }, { name: "Andorre", c: "376-AD-0", b: "376", f: "AD" }, { name: "Angola", c: "244-AO-0", b: "244", f: "AO" }, { name: "Anguilla", c: "1-AI-0", b: "1", f: "AI" }, { name: "Antigua-et-Barbuda", c: "1-AG-0", b: "1", f: "AG" }, { name: "Argentine", c: "54-AR-0", b: "54", f: "AR" }, { name: "Arm\u00e9nie", c: "374-AM-0", b: "374", f: "AM" },
                        { name: "Aruba", c: "297-AW-0", b: "297", f: "AW" }, { name: "Ascension (\u00cele)", c: "247-AC-0", b: "247", f: "AC" }, { name: "Australie", c: "61-AU-0", b: "61", f: "AU" }, { name: "Autriche", c: "43-AT-0", b: "43", f: "AT" }, { name: "Azerba\u00efdjan", c: "994-AZ-0", b: "994", f: "AZ" }, { name: "Bahamas", c: "1-BS-0", b: "1", f: "BS" }, { name: "Bahre\u00efn", c: "973-BH-0", b: "973", f: "BH" }, { name: "Bangladesh", c: "880-BD-0", b: "880", f: "BD" }, { name: "Barbade", c: "1-BB-0", b: "1", f: "BB" }, { name: "Bi\u00e9lorussie", c: "375-BY-0", b: "375", f: "BY" }, {
                            name: "Belgique", c: "32-BE-0",
                            b: "32", f: "BE"
                        }, { name: "Belize", c: "501-BZ-0", b: "501", f: "BZ" }, { name: "B\u00e9nin", c: "229-BJ-0", b: "229", f: "BJ" }, { name: "Bermudes", c: "1-BM-0", b: "1", f: "BM" }, { name: "Bhoutan", c: "975-BT-0", b: "975", f: "BT" }, { name: "Bolivie", c: "591-BO-0", b: "591", f: "BO" }, { name: "Bosnie-Herz\u00e9govine", c: "387-BA-0", b: "387", f: "BA" }, { name: "Botswana", c: "267-BW-0", b: "267", f: "BW" }, { name: "Br\u00e9sil", c: "55-BR-0", b: "55", f: "BR" }, { name: "Territoire britannique de l'oc\u00e9an Indien", c: "246-IO-0", b: "246", f: "IO" }, {
                            name: "\u00celes Vierges britanniques",
                            c: "1-VG-0", b: "1", f: "VG"
                        }, { name: "Brunei", c: "673-BN-0", b: "673", f: "BN" }, { name: "Bulgarie", c: "359-BG-0", b: "359", f: "BG" }, { name: "Burkina Faso", c: "226-BF-0", b: "226", f: "BF" }, { name: "Burundi", c: "257-BI-0", b: "257", f: "BI" }, { name: "Cambodge", c: "855-KH-0", b: "855", f: "KH" }, { name: "Cameroun", c: "237-CM-0", b: "237", f: "CM" }, { name: "Canada", c: "1-CA-0", b: "1", f: "CA" }, { name: "Cap-Vert", c: "238-CV-0", b: "238", f: "CV" }, { name: "Antilles n\u00e9erlandaises", c: "599-BQ-0", b: "599", f: "BQ" }, {
                            name: "Ca\u00efmans (\u00celes)", c: "1-KY-0", b: "1",
                            f: "KY"
                        }, { name: "R\u00e9publique centrafricaine", c: "236-CF-0", b: "236", f: "CF" }, { name: "Tchad", c: "235-TD-0", b: "235", f: "TD" }, { name: "Chili", c: "56-CL-0", b: "56", f: "CL" }, { name: "Chine", c: "86-CN-0", b: "86", f: "CN" }, { name: "Christmas (\u00cele)", c: "61-CX-0", b: "61", f: "CX" }, { name: "Cocos (\u00celes) (Keeling)", c: "61-CC-0", b: "61", f: "CC" }, { name: "Colombie", c: "57-CO-0", b: "57", f: "CO" }, { name: "Comores", c: "269-KM-0", b: "269", f: "KM" }, { name: "R\u00e9publique d\u00e9mocratique du Congo", c: "243-CD-0", b: "243", f: "CD" }, {
                            name: "R\u00e9publique du Congo",
                            c: "242-CG-0", b: "242", f: "CG"
                        }, { name: "Cook (\u00celes)", c: "682-CK-0", b: "682", f: "CK" }, { name: "Costa Rica", c: "506-CR-0", b: "506", f: "CR" }, { name: "C\u00f4te d'Ivoire", c: "225-CI-0", b: "225", f: "CI" }, { name: "Croatie", c: "385-HR-0", b: "385", f: "HR" }, { name: "Cuba", c: "53-CU-0", b: "53", f: "CU" }, { name: "Cura\u00e7ao", c: "599-CW-0", b: "599", f: "CW" }, { name: "Chypre", c: "357-CY-0", b: "357", f: "CY" }, { name: "R\u00e9publique tch\u00e8que", c: "420-CZ-0", b: "420", f: "CZ" }, { name: "Danemark", c: "45-DK-0", b: "45", f: "DK" }, {
                            name: "Djibouti", c: "253-DJ-0",
                            b: "253", f: "DJ"
                        }, { name: "Dominique", c: "1-DM-0", b: "1", f: "DM" }, { name: "R\u00e9publique dominicaine", c: "1-DO-0", b: "1", f: "DO" }, { name: "Timor Oriental", c: "670-TL-0", b: "670", f: "TL" }, { name: "\u00c9quateur", c: "593-EC-0", b: "593", f: "EC" }, { name: "\u00c9gypte", c: "20-EG-0", b: "20", f: "EG" }, { name: "Salvador", c: "503-SV-0", b: "503", f: "SV" }, { name: "Guin\u00e9e \u00e9quatoriale", c: "240-GQ-0", b: "240", f: "GQ" }, { name: "\u00c9rythr\u00e9e", c: "291-ER-0", b: "291", f: "ER" }, { name: "Estonie", c: "372-EE-0", b: "372", f: "EE" }, {
                            name: "\u00c9thiopie",
                            c: "251-ET-0", b: "251", f: "ET"
                        }, { name: "Falkland (\u00celes Malouines)", c: "500-FK-0", b: "500", f: "FK" }, { name: "F\u00e9ro\u00e9 (\u00celes)", c: "298-FO-0", b: "298", f: "FO" }, { name: "Fidji", c: "679-FJ-0", b: "679", f: "FJ" }, { name: "Finlande", c: "358-FI-0", b: "358", f: "FI" }, { name: "France", c: "33-FR-0", b: "33", f: "FR" }, { name: "Guyane fran\u00e7aise", c: "594-GF-0", b: "594", f: "GF" }, { name: "Polyn\u00e9sie fran\u00e7aise", c: "689-PF-0", b: "689", f: "PF" }, { name: "Gabon", c: "241-GA-0", b: "241", f: "GA" }, { name: "Gambie", c: "220-GM-0", b: "220", f: "GM" },
                        { name: "G\u00e9orgie", c: "995-GE-0", b: "995", f: "GE" }, { name: "Allemagne", c: "49-DE-0", b: "49", f: "DE" }, { name: "Ghana", c: "233-GH-0", b: "233", f: "GH" }, { name: "Gibraltar", c: "350-GI-0", b: "350", f: "GI" }, { name: "Gr\u00e8ce", c: "30-GR-0", b: "30", f: "GR" }, { name: "Groenland", c: "299-GL-0", b: "299", f: "GL" }, { name: "Grenade", c: "1-GD-0", b: "1", f: "GD" }, { name: "Guadeloupe", c: "590-GP-0", b: "590", f: "GP" }, { name: "Guam", c: "1-GU-0", b: "1", f: "GU" }, { name: "Guatemala", c: "502-GT-0", b: "502", f: "GT" }, { name: "Guernesey", c: "44-GG-0", b: "44", f: "GG" }, {
                            name: "Guin\u00e9e",
                            c: "224-GN-0", b: "224", f: "GN"
                        }, { name: "Guin\u00e9e-Bissau", c: "245-GW-0", b: "245", f: "GW" }, { name: "Guyane", c: "592-GY-0", b: "592", f: "GY" }, { name: "Ha\u00efti", c: "509-HT-0", b: "509", f: "HT" }, { name: "Heard et McDonald (\u00celes)", c: "672-HM-0", b: "672", f: "HM" }, { name: "Honduras", c: "504-HN-0", b: "504", f: "HN" }, { name: "Hong\u00a0Kong", c: "852-HK-0", b: "852", f: "HK" }, { name: "Hongrie", c: "36-HU-0", b: "36", f: "HU" }, { name: "Islande", c: "354-IS-0", b: "354", f: "IS" }, { name: "Inde", c: "91-IN-0", b: "91", f: "IN" }, {
                            name: "Indon\u00e9sie", c: "62-ID-0",
                            b: "62", f: "ID"
                        }, { name: "Iran", c: "98-IR-0", b: "98", f: "IR" }, { name: "Iraq", c: "964-IQ-0", b: "964", f: "IQ" }, { name: "Irlande", c: "353-IE-0", b: "353", f: "IE" }, { name: "Man (\u00cele)", c: "44-IM-0", b: "44", f: "IM" }, { name: "Isra\u00ebl", c: "972-IL-0", b: "972", f: "IL" }, { name: "Italie", c: "39-IT-0", b: "39", f: "IT" }, { name: "Jama\u00efque", c: "1-JM-0", b: "1", f: "JM" }, { name: "Japon", c: "81-JP-0", b: "81", f: "JP" }, { name: "Jersey", c: "44-JE-0", b: "44", f: "JE" }, { name: "Jordanie", c: "962-JO-0", b: "962", f: "JO" }, { name: "Kazakhstan", c: "7-KZ-0", b: "7", f: "KZ" },
                        { name: "Kenya", c: "254-KE-0", b: "254", f: "KE" }, { name: "Kiribati", c: "686-KI-0", b: "686", f: "KI" }, { name: "Kosovo", c: "377-XK-0", b: "377", f: "XK" }, { name: "Kosovo", c: "381-XK-0", b: "381", f: "XK" }, { name: "Kosovo", c: "386-XK-0", b: "386", f: "XK" }, { name: "Kowe\u00eft", c: "965-KW-0", b: "965", f: "KW" }, { name: "Kirghizstan", c: "996-KG-0", b: "996", f: "KG" }, { name: "Laos", c: "856-LA-0", b: "856", f: "LA" }, { name: "Lettonie", c: "371-LV-0", b: "371", f: "LV" }, { name: "Liban", c: "961-LB-0", b: "961", f: "LB" }, { name: "Lesotho", c: "266-LS-0", b: "266", f: "LS" }, {
                            name: "Lib\u00e9ria",
                            c: "231-LR-0", b: "231", f: "LR"
                        }, { name: "Libye", c: "218-LY-0", b: "218", f: "LY" }, { name: "Liechtenstein", c: "423-LI-0", b: "423", f: "LI" }, { name: "Lituanie", c: "370-LT-0", b: "370", f: "LT" }, { name: "Luxembourg", c: "352-LU-0", b: "352", f: "LU" }, { name: "Macao", c: "853-MO-0", b: "853", f: "MO" }, { name: "Mac\u00e9doine", c: "389-MK-0", b: "389", f: "MK" }, { name: "Madagascar", c: "261-MG-0", b: "261", f: "MG" }, { name: "Malawi", c: "265-MW-0", b: "265", f: "MW" }, { name: "Malaisie", c: "60-MY-0", b: "60", f: "MY" }, { name: "Maldives", c: "960-MV-0", b: "960", f: "MV" }, {
                            name: "Mali",
                            c: "223-ML-0", b: "223", f: "ML"
                        }, { name: "Malte", c: "356-MT-0", b: "356", f: "MT" }, { name: "Marshall (\u00celes)", c: "692-MH-0", b: "692", f: "MH" }, { name: "Martinique", c: "596-MQ-0", b: "596", f: "MQ" }, { name: "Mauritanie", c: "222-MR-0", b: "222", f: "MR" }, { name: "Maurice (\u00cele)", c: "230-MU-0", b: "230", f: "MU" }, { name: "Mayotte", c: "262-YT-0", b: "262", f: "YT" }, { name: "Mexique", c: "52-MX-0", b: "52", f: "MX" }, { name: "Micron\u00e9sie", c: "691-FM-0", b: "691", f: "FM" }, { name: "Moldavie", c: "373-MD-0", b: "373", f: "MD" }, {
                            name: "Monaco", c: "377-MC-0", b: "377",
                            f: "MC"
                        }, { name: "Mongolie", c: "976-MN-0", b: "976", f: "MN" }, { name: "Mont\u00e9n\u00e9gro", c: "382-ME-0", b: "382", f: "ME" }, { name: "Montserrat", c: "1-MS-0", b: "1", f: "MS" }, { name: "Maroc", c: "212-MA-0", b: "212", f: "MA" }, { name: "Mozambique", c: "258-MZ-0", b: "258", f: "MZ" }, { name: "Myanmar (Birmanie)", c: "95-MM-0", b: "95", f: "MM" }, { name: "Namibie", c: "264-NA-0", b: "264", f: "NA" }, { name: "Nauru", c: "674-NR-0", b: "674", f: "NR" }, { name: "N\u00e9pal", c: "977-NP-0", b: "977", f: "NP" }, { name: "Pays-Bas", c: "31-NL-0", b: "31", f: "NL" }, {
                            name: "Nouvelle-Cal\u00e9donie",
                            c: "687-NC-0", b: "687", f: "NC"
                        }, { name: "Nouvelle-Z\u00e9lande", c: "64-NZ-0", b: "64", f: "NZ" }, { name: "Nicaragua", c: "505-NI-0", b: "505", f: "NI" }, { name: "Niger", c: "227-NE-0", b: "227", f: "NE" }, { name: "Nig\u00e9ria", c: "234-NG-0", b: "234", f: "NG" }, { name: "Niu\u00e9", c: "683-NU-0", b: "683", f: "NU" }, { name: "Norfolk (\u00cele)", c: "672-NF-0", b: "672", f: "NF" }, { name: "Cor\u00e9e du Nord", c: "850-KP-0", b: "850", f: "KP" }, { name: "Mariannes du Nord (\u00celes)", c: "1-MP-0", b: "1", f: "MP" }, { name: "Norv\u00e8ge", c: "47-NO-0", b: "47", f: "NO" }, {
                            name: "Oman",
                            c: "968-OM-0", b: "968", f: "OM"
                        }, { name: "Pakistan", c: "92-PK-0", b: "92", f: "PK" }, { name: "Palaos", c: "680-PW-0", b: "680", f: "PW" }, { name: "Territoires palestiniens", c: "970-PS-0", b: "970", f: "PS" }, { name: "Panama", c: "507-PA-0", b: "507", f: "PA" }, { name: "Papouasie - Nouvelle-Guin\u00e9e", c: "675-PG-0", b: "675", f: "PG" }, { name: "Paraguay", c: "595-PY-0", b: "595", f: "PY" }, { name: "P\u00e9rou", c: "51-PE-0", b: "51", f: "PE" }, { name: "Philippines", c: "63-PH-0", b: "63", f: "PH" }, { name: "Pologne", c: "48-PL-0", b: "48", f: "PL" }, {
                            name: "Portugal", c: "351-PT-0",
                            b: "351", f: "PT"
                        }, { name: "Porto Rico", c: "1-PR-0", b: "1", f: "PR" }, { name: "Qatar", c: "974-QA-0", b: "974", f: "QA" }, { name: "La R\u00e9union", c: "262-RE-0", b: "262", f: "RE" }, { name: "Roumanie", c: "40-RO-0", b: "40", f: "RO" }, { name: "Russie", c: "7-RU-0", b: "7", f: "RU" }, { name: "Rwanda", c: "250-RW-0", b: "250", f: "RW" }, { name: "Saint-Barth\u00e9lemy", c: "590-BL-0", b: "590", f: "BL" }, { name: "Sainte-H\u00e9l\u00e8ne", c: "290-SH-0", b: "290", f: "SH" }, { name: "Saint-Kitts", c: "1-KN-0", b: "1", f: "KN" }, { name: "Sainte-Lucie", c: "1-LC-0", b: "1", f: "LC" }, {
                            name: "Saint-Martin",
                            c: "590-MF-0", b: "590", f: "MF"
                        }, { name: "Saint-Pierre-et-Miquelon", c: "508-PM-0", b: "508", f: "PM" }, { name: "Saint-Vincent", c: "1-VC-0", b: "1", f: "VC" }, { name: "Samoa", c: "685-WS-0", b: "685", f: "WS" }, { name: "Saint-Marin", c: "378-SM-0", b: "378", f: "SM" }, { name: "Sao Tom\u00e9-et-Principe", c: "239-ST-0", b: "239", f: "ST" }, { name: "Arabie saoudite", c: "966-SA-0", b: "966", f: "SA" }, { name: "S\u00e9n\u00e9gal", c: "221-SN-0", b: "221", f: "SN" }, { name: "Serbie", c: "381-RS-0", b: "381", f: "RS" }, { name: "Seychelles", c: "248-SC-0", b: "248", f: "SC" }, {
                            name: "Sierra Leone",
                            c: "232-SL-0", b: "232", f: "SL"
                        }, { name: "Singapour", c: "65-SG-0", b: "65", f: "SG" }, { name: "Saint-Martin", c: "1-SX-0", b: "1", f: "SX" }, { name: "Slovaquie", c: "421-SK-0", b: "421", f: "SK" }, { name: "Slov\u00e9nie", c: "386-SI-0", b: "386", f: "SI" }, { name: "Salomon (\u00celes)", c: "677-SB-0", b: "677", f: "SB" }, { name: "Somalie", c: "252-SO-0", b: "252", f: "SO" }, { name: "Afrique du Sud", c: "27-ZA-0", b: "27", f: "ZA" }, { name: "G\u00e9orgie du Sud et Sandwich du Sud (\u00celes)", c: "500-GS-0", b: "500", f: "GS" }, {
                            name: "Cor\u00e9e du Sud", c: "82-KR-0", b: "82",
                            f: "KR"
                        }, { name: "Soudan du Sud", c: "211-SS-0", b: "211", f: "SS" }, { name: "Espagne", c: "34-ES-0", b: "34", f: "ES" }, { name: "Sri Lanka", c: "94-LK-0", b: "94", f: "LK" }, { name: "Soudan", c: "249-SD-0", b: "249", f: "SD" }, { name: "Surinam", c: "597-SR-0", b: "597", f: "SR" }, { name: "Svalbard et Jan Mayen", c: "47-SJ-0", b: "47", f: "SJ" }, { name: "Swaziland", c: "268-SZ-0", b: "268", f: "SZ" }, { name: "Su\u00e8de", c: "46-SE-0", b: "46", f: "SE" }, { name: "Suisse", c: "41-CH-0", b: "41", f: "CH" }, { name: "Syrie", c: "963-SY-0", b: "963", f: "SY" }, {
                            name: "Ta\u00efwan", c: "886-TW-0",
                            b: "886", f: "TW"
                        }, { name: "Tadjikistan", c: "992-TJ-0", b: "992", f: "TJ" }, { name: "Tanzanie", c: "255-TZ-0", b: "255", f: "TZ" }, { name: "Tha\u00eflande", c: "66-TH-0", b: "66", f: "TH" }, { name: "Togo", c: "228-TG-0", b: "228", f: "TG" }, { name: "Tok\u00e9laou", c: "690-TK-0", b: "690", f: "TK" }, { name: "Tonga", c: "676-TO-0", b: "676", f: "TO" }, { name: "Trinit\u00e9-et-Tobago", c: "1-TT-0", b: "1", f: "TT" }, { name: "Tunisie", c: "216-TN-0", b: "216", f: "TN" }, { name: "Turquie", c: "90-TR-0", b: "90", f: "TR" }, { name: "Turkm\u00e9nistan", c: "993-TM-0", b: "993", f: "TM" }, {
                            name: "Turks-et-Ca\u00efcos (\u00celes)",
                            c: "1-TC-0", b: "1", f: "TC"
                        }, { name: "Tuvalu", c: "688-TV-0", b: "688", f: "TV" }, { name: "\u00celes Vierges am\u00e9ricaines", c: "1-VI-0", b: "1", f: "VI" }, { name: "Ouganda", c: "256-UG-0", b: "256", f: "UG" }, { name: "Ukrainien", c: "380-UA-0", b: "380", f: "UA" }, { name: "\u00c9mirats arabes unis", c: "971-AE-0", b: "971", f: "AE" }, { name: "Royaume-Uni", c: "44-GB-0", b: "44", f: "GB" }, { name: "\u00c9tats-Unis", c: "1-US-0", b: "1", f: "US" }, { name: "Uruguay", c: "598-UY-0", b: "598", f: "UY" }, { name: "Ouzb\u00e9kistan", c: "998-UZ-0", b: "998", f: "UZ" }, {
                            name: "Vanuatu",
                            c: "678-VU-0", b: "678", f: "VU"
                        }, { name: "Cit\u00e9 du Vatican", c: "379-VA-0", b: "379", f: "VA" }, { name: "Venezuela", c: "58-VE-0", b: "58", f: "VE" }, { name: "Vi\u00eat Nam", c: "84-VN-0", b: "84", f: "VN" }, { name: "Wallis-et-Futuna", c: "681-WF-0", b: "681", f: "WF" }, { name: "Sahara occidental", c: "212-EH-0", b: "212", f: "EH" }, { name: "Y\u00e9men", c: "967-YE-0", b: "967", f: "YE" }, { name: "Zambie", c: "260-ZM-0", b: "260", f: "ZM" }, { name: "Zimbabwe", c: "263-ZW-0", b: "263", f: "ZW" }]; (function (a, b) { a.sort(function (a, d) { return a.name.localeCompare(d.name, b) }) })(jh,
                            "fr"); var hh = new function () { this.a = jh; this.g = new ch; for (var a = 0; a < this.a.length; a++) { var b = this.g.get("+" + this.a[a].b); b ? b.push(this.a[a]) : this.g.add("+" + this.a[a].b, [this.a[a]]) } }; function kh(a, b) { this.a = a; this.na = b } function lh(a) { a = Ja(a); var b = gh(a); return 0 < b.length ? new kh("1" == b[0].b ? "1-US-0" : b[0].c, Ja(a.substr(b[0].b.length + 1))) : null } function mh(a) { var b = ih(a.a); if (!b) throw Error("Country ID " + a.a + " not found."); return "+" + b.b + a.na } function nh() {
                            this.a = new Zg; $g(this.a, "acUiConfig"); $g(this.a,
                                "autoUpgradeAnonymousUsers"); $g(this.a, "callbacks"); $g(this.a, "credentialHelper", oh); $g(this.a, "popupMode", !1); $g(this.a, "queryParameterForSignInSuccessUrl", "signInSuccessUrl"); $g(this.a, "queryParameterForWidgetMode", "mode"); $g(this.a, "signInFlow"); $g(this.a, "signInOptions"); $g(this.a, "signInSuccessUrl"); $g(this.a, "siteName"); $g(this.a, "tosUrl"); $g(this.a, "widgetUrl")
                            } var oh = "accountchooser.com", ph = { Db: oh, Fb: "googleyolo", NONE: "none" }, qh = { Gb: "popup", Ib: "redirect" }; function rh(a) {
                                return a.a.get("acUiConfig") ||
                                    null
                            } var sh = { Eb: "callback", Hb: "recoverEmail", Jb: "resetPassword", Kb: "select", Lb: "verifyEmail" }, th = ["sitekey", "tabindex", "callback", "expired-callback"]; function uh(a) { var b = a.a.get("widgetUrl") || window.location.href; return vh(a, b) } function vh(a, b) {
                                a = wh(a); for (var c = b.search(yc), d = 0, e, f = []; 0 <= (e = xc(b, d, a, c));)f.push(b.substring(d, e)), d = Math.min(b.indexOf("&", e) + 1 || c, c); f.push(b.substr(d)); b = f.join("").replace(Ac, "$1"); c = "=" + encodeURIComponent("select"); (a += c) ? (c = b.indexOf("#"), 0 > c && (c = b.length), d = b.indexOf("?"),
                                    0 > d || d > c ? (d = c, e = "") : e = b.substring(d + 1, c), b = [b.substr(0, d), e, b.substr(c)], c = b[1], b[1] = a ? c ? c + "&" + a : a : c, a = b[0] + (b[1] ? "?" + b[1] : "") + b[2]) : a = b; return a
                            } function xh(a) { var b = !!a.a.get("autoUpgradeAnonymousUsers"); b && !yh(a) && lg('Missing "signInFailure" callback: "signInFailure" callback needs to be provided when "autoUpgradeAnonymousUsers" is set to true.'); return b } function zh(a) { a = a.a.get("signInOptions") || []; for (var b = [], c = 0; c < a.length; c++) { var d = a[c]; d = za(d) ? d : { provider: d }; og[d.provider] && b.push(d) } return b }
        function Ah(a, b) { a = zh(a); for (var c = 0; c < a.length; c++)if (a[c].provider === b) return a[c]; return null } function Bh(a) { return Za(zh(a), function (a) { return a.provider }) } function Ch(a) { var b = [], c = []; Wa(zh(a), function (a) { a.authMethod && (b.push(a.authMethod), a.clientId && c.push({ uri: a.authMethod, clientId: a.clientId })) }); var d = null; "googleyolo" === Dh(a) && b.length && (d = { supportedIdTokenProviders: c, supportedAuthMethods: b }); return d } function Eh(a, b) {
            var c = null; Wa(zh(a), function (a) { a.authMethod === b && (c = a.provider) });
            return c
        } function Fh(a) { var b = null; Wa(zh(a), function (a) { a.provider == firebase.auth.PhoneAuthProvider.PROVIDER_ID && za(a.recaptchaParameters) && !va(a.recaptchaParameters) && (b = mb(a.recaptchaParameters)) }); if (b) { var c = []; Wa(th, function (a) { "undefined" !== typeof b[a] && (c.push(a), delete b[a]) }); c.length && Vf && Uf('The following provided "recaptchaParameters" keys are not allowed: ' + c.join(", ")) } return b } function Gh(a, b) { a = (a = Ah(a, b)) && a.scopes; return va(a) ? a : [] } function Hh(a, b) {
            a = (a = Ah(a, b)) && a.customParameters;
            return za(a) ? (a = mb(a), b === firebase.auth.GoogleAuthProvider.PROVIDER_ID && delete a.login_hint, a) : null
        } function Ih(a) { a = Ah(a, firebase.auth.PhoneAuthProvider.PROVIDER_ID); var b = null; a && m(a.loginHint) && (b = lh(a.loginHint)); return a && a.defaultNationalNumber || b && b.na || null } function Jh(a) {
            var b = (a = Ah(a, firebase.auth.PhoneAuthProvider.PROVIDER_ID)) && a.defaultCountry || null, c; if (c = b) { b = b.toUpperCase(); c = []; for (var d = 0; d < jh.length; d++)jh[d].f === b && c.push(jh[d]) } b = c; c = null; a && m(a.loginHint) && (c = lh(a.loginHint));
            return b && b[0] || c && ih(c.a) || null
        } function wh(a) { return bh(a.a, "queryParameterForWidgetMode") } function Kh(a) { return a.a.get("tosUrl") || null } function Lh(a) { return (a = Ah(a, firebase.auth.EmailAuthProvider.PROVIDER_ID)) && "undefined" !== typeof a.requireDisplayName ? !!a.requireDisplayName : !0 } function Mh(a) { a = a.a.get("signInFlow"); for (var b in qh) if (qh[b] == a) return qh[b]; return "redirect" } function Nh(a) { return Oh(a).uiShown || null } function Ph(a) { return Oh(a).signInSuccess || null } function Qh(a) {
            return Oh(a).signInSuccessWithAuthResult ||
                null
        } function yh(a) { return Oh(a).signInFailure || null } function Oh(a) { return a.a.get("callbacks") || {} } function Dh(a) { if ("http:" !== (window.location && window.location.protocol) && "https:" !== (window.location && window.location.protocol)) return "none"; a = a.a.get("credentialHelper"); for (var b in ph) if (ph[b] == a) return ph[b]; return oh } var Rh = null; function Sh(a) { return !(!a || -32E3 != a.code || "Service unavailable" != a.message) } function Th(a, b, c, d) {
            Rh || (a = {
                callbacks: {
                    empty: a, select: function (a, d) {
                    a && a.account && b ? b(ng(a.account)) :
                        c && c(!Sh(d))
                    }, store: a, update: a
                }, language: "fr", providers: void 0, ui: d
            }, "undefined" != typeof accountchooser && accountchooser.Api && accountchooser.Api.init ? Rh = accountchooser.Api.init(a) : (Rh = new Uh(a), Vh()))
        } function Wh(a, b, c) { function d() { var a = Qc(c).toString(); Rh.select(Za(b || [], function (a) { return a.fa() }), { clientCallbackUrl: a }) } b && b.length ? d() : Rh.checkEmpty(function (b, c) { b || c ? a(!Sh(c)) : d() }) } function Uh(a) { this.a = a; this.a.callbacks = this.a.callbacks || {} } function Vh() { var a = Rh; xa(a.a.callbacks.empty) && a.a.callbacks.empty() }
        var Xh = { code: -32E3, message: "Service unavailable", data: "Service is unavailable." }; h = Uh.prototype; h.store = function () { xa(this.a.callbacks.store) && this.a.callbacks.store(void 0, Xh) }; h.select = function () { xa(this.a.callbacks.select) && this.a.callbacks.select(void 0, Xh) }; h.update = function () { xa(this.a.callbacks.update) && this.a.callbacks.update(void 0, Xh) }; h.checkDisabled = function (a) { a(!0) }; h.checkEmpty = function (a) { a(void 0, Xh) }; h.checkAccountExist = function (a, b) { b(void 0, Xh) }; h.checkShouldUpdate = function (a,
            b) { b(void 0, Xh) }; var Yh, Zh, $h, G = {}; function H(a, b, c, d) { G[a].apply(null, Array.prototype.slice.call(arguments, 1)) } var ai = /MSIE ([\d.]+).*Windows NT ([\d.]+)/, bi = /Firefox\/([\d.]+)/, ci = /Opera[ \/]([\d.]+)(.*Version\/([\d.]+))?/, di = /Chrome\/([\d.]+)/, ei = /((Windows NT ([\d.]+))|(Mac OS X ([\d_]+))).*Version\/([\d.]+).*Safari/, fi = /Mac OS X;.*(?!(Version)).*Safari/, gi = /Android ([\d.]+).*Safari/, hi = /OS ([\d_]+) like Mac OS X.*Mobile.*Safari/, ii = /Konqueror\/([\d.]+)/, ji = /MSIE ([\d.]+).*Windows Phone OS ([\d.]+)/;
        function I(a, b) { a = a.split(b || "."); this.a = []; for (b = 0; b < a.length; b++)this.a.push(parseInt(a[b], 10)) } function ki(a, b) { b instanceof I || (b = new I(String(b))); for (var c = Math.max(a.a.length, b.a.length), d = 0; d < c; d++) { var e = a.a[d], f = b.a[d]; if (void 0 !== e && void 0 !== f && e !== f) return e - f; if (void 0 === e) return -1; if (void 0 === f) return 1 } return 0 } function J(a, b) { return 0 <= ki(a, b) } function li() {
            var a = window.navigator && window.navigator.userAgent; if (a) {
                var b; if (b = a.match(ci)) {
                    var c = new I(b[3] || b[1]); return 0 <= a.indexOf("Opera Mini") ?
                        !1 : 0 <= a.indexOf("Opera Mobi") ? 0 <= a.indexOf("Android") && J(c, "10.1") : J(c, "8.0")
                } if (b = a.match(bi)) return J(new I(b[1]), "2.0"); if (b = a.match(di)) return J(new I(b[1]), "6.0"); if (b = a.match(ei)) return c = new I(b[6]), a = b[3] && new I(b[3]), b = b[5] && new I(b[5], "_"), (!(!a || !J(a, "6.0")) || !(!b || !J(b, "10.5.6"))) && J(c, "3.0"); if (b = a.match(gi)) return J(new I(b[1]), "3.0"); if (b = a.match(hi)) return J(new I(b[1], "_"), "4.0"); if (b = a.match(ii)) return J(new I(b[1]), "4.7"); if (b = a.match(ji)) return c = new I(b[1]), a = new I(b[2]), J(c,
                    "7.0") && J(a, "7.0"); if (b = a.match(ai)) return c = new I(b[1]), a = new I(b[2]), J(c, "7.0") && J(a, "6.0"); if (a.match(fi)) return !1
            } return !0
        } function mi(a) { if (a.classList) return a.classList; a = a.className; return m(a) && a.match(/\S+/g) || [] } function ni(a, b) { return a.classList ? a.classList.contains(b) : bb(mi(a), b) } function oi(a, b) { a.classList ? a.classList.add(b) : ni(a, b) || (a.className += 0 < a.className.length ? " " + b : b) } function pi(a, b) { a.classList ? a.classList.remove(b) : ni(a, b) && (a.className = Ya(mi(a), function (a) { return a != b }).join(" ")) }
        function K(a) { var b = a.type; switch (m(b) && b.toLowerCase()) { case "checkbox": case "radio": return a.checked ? a.value : null; case "select-one": return b = a.selectedIndex, 0 <= b ? a.options[b].value : null; case "select-multiple": b = []; for (var c, d = 0; c = a.options[d]; d++)c.selected && b.push(c.value); return b.length ? b : null; default: return null != a.value ? a.value : null } } function qi(a) {
            if (a.altKey && !a.ctrlKey || a.metaKey || 112 <= a.keyCode && 123 >= a.keyCode) return !1; switch (a.keyCode) {
                case 18: case 20: case 93: case 17: case 40: case 35: case 27: case 36: case 45: case 37: case 224: case 91: case 144: case 12: case 34: case 33: case 19: case 255: case 44: case 39: case 145: case 16: case 38: case 252: case 224: case 92: return !1;
                case 0: return !wb; default: return 166 > a.keyCode || 183 < a.keyCode
            }
        } function ri(a, b, c, d, e, f) { if (!(v || ub || w && Eb("525"))) return !0; if (yb && e) return si(a); if (e && !d) return !1; "number" == typeof b && (b = ti(b)); e = 17 == b || 18 == b || yb && 91 == b; if ((!c || yb) && e || yb && 16 == b && (d || f)) return !1; if ((w || ub) && d && c) switch (a) { case 220: case 219: case 221: case 192: case 186: case 189: case 187: case 188: case 190: case 191: case 192: case 222: return !1 }if (v && d && b == a) return !1; switch (a) { case 13: return !0; case 27: return !(w || ub) }return si(a) } function si(a) {
            if (48 <=
                a && 57 >= a || 96 <= a && 106 >= a || 65 <= a && 90 >= a || (w || ub) && 0 == a) return !0; switch (a) { case 32: case 43: case 63: case 64: case 107: case 109: case 110: case 111: case 186: case 59: case 189: case 187: case 61: case 188: case 190: case 191: case 192: case 222: case 219: case 220: case 221: return !0; default: return !1 }
        } function ti(a) { if (wb) a = ui(a); else if (yb && w) switch (a) { case 93: a = 91 }return a } function ui(a) { switch (a) { case 61: return 187; case 59: return 186; case 173: return 189; case 224: return 91; case 0: return 224; default: return a } } function vi(a) {
            C.call(this);
            this.a = a; ee(a, wi, this.g, !1, this); ee(a, "click", this.h, !1, this)
        } t(vi, C); var wi = wb ? "keypress" : "keydown"; vi.prototype.g = function (a) { (13 == a.keyCode || w && 3 == a.keyCode) && xi(this, a) }; vi.prototype.h = function (a) { xi(this, a) }; function xi(a, b) { var c = new yi(b); if (re(a, c)) { c = new zi(b); try { re(a, c) } finally { b.stopPropagation() } } } vi.prototype.l = function () { vi.o.l.call(this); me(this.a, wi, this.g, !1, this); me(this.a, "click", this.h, !1, this); delete this.a }; function zi(a) { B.call(this, a.a); this.type = "action" } t(zi, B); function yi(a) {
            B.call(this,
                a.a); this.type = "beforeaction"
        } t(yi, B); function Ai(a) { C.call(this); this.a = a; a = v ? "focusout" : "blur"; this.g = ee(this.a, v ? "focusin" : "focus", this, !v); this.h = ee(this.a, a, this, !v) } t(Ai, C); Ai.prototype.handleEvent = function (a) { var b = new B(a.a); b.type = "focusin" == a.type || "focus" == a.type ? "focusin" : "focusout"; re(this, b) }; Ai.prototype.l = function () { Ai.o.l.call(this); ne(this.g); ne(this.h); delete this.a }; function Bi(a, b) { C.call(this); this.g = a || 1; this.a = b || l; this.h = n(this.Ab, this); this.j = Fa() } t(Bi, C); h = Bi.prototype;
        h.za = !1; h.R = null; h.Ab = function () { if (this.za) { var a = Fa() - this.j; 0 < a && a < .8 * this.g ? this.R = this.a.setTimeout(this.h, this.g - a) : (this.R && (this.a.clearTimeout(this.R), this.R = null), re(this, "tick"), this.za && (this.R = this.a.setTimeout(this.h, this.g), this.j = Fa())) } }; h.start = function () { this.za = !0; this.R || (this.R = this.a.setTimeout(this.h, this.g), this.j = Fa()) }; function Ci(a) { a.za = !1; a.R && (a.a.clearTimeout(a.R), a.R = null) } h.l = function () { Bi.o.l.call(this); Ci(this); delete this.a }; function Di(a, b) {
            if (xa(a)) b && (a = n(a,
                b)); else if (a && "function" == typeof a.handleEvent) a = n(a.handleEvent, a); else throw Error("Invalid listener argument"); return 2147483647 < Number(0) ? -1 : l.setTimeout(a, 0)
        } function Ei(a) { Id.call(this); this.g = a; this.a = {} } t(Ei, Id); var Fi = []; Ei.prototype.Z = function (a, b, c, d) { va(b) || (b && (Fi[0] = b.toString()), b = Fi); for (var e = 0; e < b.length; e++) { var f = ee(a, b[e], c || this.handleEvent, d || !1, this.g || this); if (!f) break; this.a[f.key] = f } return this }; Ei.prototype.La = function (a, b, c, d, e) {
            if (va(b)) for (var f = 0; f < b.length; f++)this.La(a,
                b[f], c, d, e); else c = c || this.handleEvent, d = za(d) ? !!d.capture : !!d, e = e || this.g || this, c = ge(c), d = !!d, b = Ud(a) ? ae(a.A, String(b), c, d, e) : a ? (a = ie(a)) ? ae(a, b, c, d, e) : null : null, b && (ne(b), delete this.a[b.key])
        }; function Gi(a) { lb(a.a, function (a, c) { this.a.hasOwnProperty(c) && ne(a) }, a); a.a = {} } Ei.prototype.l = function () { Ei.o.l.call(this); Gi(this) }; Ei.prototype.handleEvent = function () { throw Error("EventHandler.handleEvent not implemented"); }; function Hi(a) {
            C.call(this); this.a = null; this.g = a; a = v || ub || w && !Eb("531") && "TEXTAREA" ==
                a.tagName; this.h = new Ei(this); this.h.Z(this.g, a ? ["keydown", "paste", "cut", "drop", "input"] : "input", this)
        } t(Hi, C); Hi.prototype.handleEvent = function (a) { if ("input" == a.type) v && Eb(10) && 0 == a.keyCode && 0 == a.j || (Ii(this), re(this, Ji(a))); else if ("keydown" != a.type || qi(a)) { var b = "keydown" == a.type ? this.g.value : null; v && 229 == a.keyCode && (b = null); var c = Ji(a); Ii(this); this.a = Di(function () { this.a = null; this.g.value != b && re(this, c) }, this) } }; function Ii(a) { null != a.a && (l.clearTimeout(a.a), a.a = null) } function Ji(a) {
            a = new B(a.a);
            a.type = "input"; return a
        } Hi.prototype.l = function () { Hi.o.l.call(this); this.h.m(); Ii(this); delete this.g }; function Ki(a, b) { C.call(this); a && (this.Da && Li(this), this.ia = a, this.Ca = ee(this.ia, "keypress", this, b), this.Ja = ee(this.ia, "keydown", this.jb, b, this), this.Da = ee(this.ia, "keyup", this.lb, b, this)) } t(Ki, C); h = Ki.prototype; h.ia = null; h.Ca = null; h.Ja = null; h.Da = null; h.O = -1; h.Y = -1; h.Ha = !1; var Mi = {
            3: 13, 12: 144, 63232: 38, 63233: 40, 63234: 37, 63235: 39, 63236: 112, 63237: 113, 63238: 114, 63239: 115, 63240: 116, 63241: 117, 63242: 118,
            63243: 119, 63244: 120, 63245: 121, 63246: 122, 63247: 123, 63248: 44, 63272: 46, 63273: 36, 63275: 35, 63276: 33, 63277: 34, 63289: 144, 63302: 45
        }, Ni = { Up: 38, Down: 40, Left: 37, Right: 39, Enter: 13, F1: 112, F2: 113, F3: 114, F4: 115, F5: 116, F6: 117, F7: 118, F8: 119, F9: 120, F10: 121, F11: 122, F12: 123, "U+007F": 46, Home: 36, End: 35, PageUp: 33, PageDown: 34, Insert: 45 }, Oi = v || ub || w && Eb("525"), Pi = yb && wb; h = Ki.prototype; h.jb = function (a) {
            if (w || ub) if (17 == this.O && !a.ctrlKey || 18 == this.O && !a.altKey || yb && 91 == this.O && !a.metaKey) this.Y = this.O = -1; -1 == this.O && (a.ctrlKey &&
                17 != a.keyCode ? this.O = 17 : a.altKey && 18 != a.keyCode ? this.O = 18 : a.metaKey && 91 != a.keyCode && (this.O = 91)); Oi && !ri(a.keyCode, this.O, a.shiftKey, a.ctrlKey, a.altKey, a.metaKey) ? this.handleEvent(a) : (this.Y = ti(a.keyCode), Pi && (this.Ha = a.altKey))
        }; h.lb = function (a) { this.Y = this.O = -1; this.Ha = a.altKey }; h.handleEvent = function (a) {
            var b = a.a, c = b.altKey; if (v && "keypress" == a.type) { var d = this.Y; var e = 13 != d && 27 != d ? b.keyCode : 0 } else (w || ub) && "keypress" == a.type ? (d = this.Y, e = 0 <= b.charCode && 63232 > b.charCode && si(d) ? b.charCode : 0) : tb && !w ?
                (d = this.Y, e = si(d) ? b.keyCode : 0) : (d = b.keyCode || this.Y, e = b.charCode || 0, Pi && (c = this.Ha), yb && 63 == e && 224 == d && (d = 191)); var f = d = ti(d); d ? 63232 <= d && d in Mi ? f = Mi[d] : 25 == d && a.shiftKey && (f = 9) : b.keyIdentifier && b.keyIdentifier in Ni && (f = Ni[b.keyIdentifier]); a = f == this.O; this.O = f; b = new Qi(f, e, a, b); b.altKey = c; re(this, b)
        }; h.K = function () { return this.ia }; function Li(a) { a.Ca && (ne(a.Ca), ne(a.Ja), ne(a.Da), a.Ca = null, a.Ja = null, a.Da = null); a.ia = null; a.O = -1; a.Y = -1 } h.l = function () { Ki.o.l.call(this); Li(this) }; function Qi(a, b, c,
            d) { B.call(this, d); this.type = "key"; this.keyCode = a; this.j = b; this.repeat = c } t(Qi, B); function Ri(a, b, c, d) { this.top = a; this.right = b; this.bottom = c; this.left = d } Ri.prototype.toString = function () { return "(" + this.top + "t, " + this.right + "r, " + this.bottom + "b, " + this.left + "l)" }; Ri.prototype.ceil = function () { this.top = Math.ceil(this.top); this.right = Math.ceil(this.right); this.bottom = Math.ceil(this.bottom); this.left = Math.ceil(this.left); return this }; Ri.prototype.floor = function () {
            this.top = Math.floor(this.top); this.right =
                Math.floor(this.right); this.bottom = Math.floor(this.bottom); this.left = Math.floor(this.left); return this
            }; Ri.prototype.round = function () { this.top = Math.round(this.top); this.right = Math.round(this.right); this.bottom = Math.round(this.bottom); this.left = Math.round(this.left); return this }; function Si(a, b) { var c = cc(a); return c.defaultView && c.defaultView.getComputedStyle && (a = c.defaultView.getComputedStyle(a, null)) ? a[b] || a.getPropertyValue(b) || "" : "" } function Ti(a) {
                try { var b = a.getBoundingClientRect() } catch (c) {
                    return {
                        left: 0,
                        top: 0, right: 0, bottom: 0
                    }
                } v && a.ownerDocument.body && (a = a.ownerDocument, b.left -= a.documentElement.clientLeft + a.body.clientLeft, b.top -= a.documentElement.clientTop + a.body.clientTop); return b
            } function Ui(a, b) {
                b = b || ic(document); var c = b || ic(document); var d = Vi(a), e = Vi(c); if (!v || 9 <= Number(Fb)) { g = Si(c, "borderLeftWidth"); var f = Si(c, "borderRightWidth"); k = Si(c, "borderTopWidth"); q = Si(c, "borderBottomWidth"); f = new Ri(parseFloat(k), parseFloat(f), parseFloat(q), parseFloat(g)) } else {
                    var g = Wi(c, "borderLeft"); f = Wi(c, "borderRight");
                    var k = Wi(c, "borderTop"), q = Wi(c, "borderBottom"); f = new Ri(k, f, q, g)
                } c == ic(document) ? (g = d.a - c.scrollLeft, d = d.g - c.scrollTop, !v || 10 <= Number(Fb) || (g += f.left, d += f.top)) : (g = d.a - e.a - f.left, d = d.g - e.g - f.top); e = a.offsetWidth; f = a.offsetHeight; k = w && !e && !f; qa(e) && !k || !a.getBoundingClientRect ? a = new $b(e, f) : (a = Ti(a), a = new $b(a.right - a.left, a.bottom - a.top)); e = c.clientHeight - a.height; f = c.scrollLeft; k = c.scrollTop; f += Math.min(g, Math.max(g - (c.clientWidth - a.width), 0)); k += Math.min(d, Math.max(d - e, 0)); c = new Zb(f, k); b.scrollLeft =
                    c.a; b.scrollTop = c.g
            } function Vi(a) { var b = cc(a), c = new Zb(0, 0); var d = b ? cc(b) : document; d = !v || 9 <= Number(Fb) || "CSS1Compat" == ac(d).a.compatMode ? d.documentElement : d.body; if (a == d) return c; a = Ti(a); d = ac(b).a; b = ic(d); d = d.parentWindow || d.defaultView; b = v && Eb("10") && d.pageYOffset != b.scrollTop ? new Zb(b.scrollLeft, b.scrollTop) : new Zb(d.pageXOffset || b.scrollLeft, d.pageYOffset || b.scrollTop); c.a = a.left + b.a; c.g = a.top + b.g; return c } var Xi = { thin: 2, medium: 4, thick: 6 }; function Wi(a, b) {
                if ("none" == (a.currentStyle ? a.currentStyle[b +
                    "Style"] : null)) return 0; var c = a.currentStyle ? a.currentStyle[b + "Width"] : null; if (c in Xi) a = Xi[c]; else if (/^\d+px?$/.test(c)) a = parseInt(c, 10); else { b = a.style.left; var d = a.runtimeStyle.left; a.runtimeStyle.left = a.currentStyle.left; a.style.left = c; c = a.style.pixelLeft; a.style.left = b; a.runtimeStyle.left = d; a = +c } return a
            } function Yi() { } sa(Yi); Yi.prototype.a = 0; function Zi(a) { C.call(this); this.v = a || ac(); this.Na = null; this.da = !1; this.h = null; this.D = void 0; this.qa = this.ra = this.U = null } t(Zi, C); h = Zi.prototype; h.mb = Yi.Ia();
        h.K = function () { return this.h }; function L(a, b) { return a.h ? fc(b, a.h || a.v.a) : null } function $i(a) { a.D || (a.D = new Ei(a)); return a.D } h.Ka = function (a) { if (this.U && this.U != a) throw Error("Method not supported"); Zi.o.Ka.call(this, a) }; h.Ua = function () { this.h = this.v.a.createElement("DIV") }; h.render = function (a) { if (this.da) throw Error("Component already rendered"); this.h || this.Ua(); a ? a.insertBefore(this.h, null) : this.v.a.body.appendChild(this.h); this.U && !this.U.da || this.w() }; h.w = function () {
        this.da = !0; aj(this, function (a) {
        !a.da &&
            a.K() && a.w()
        })
        }; h.la = function () { aj(this, function (a) { a.da && a.la() }); this.D && Gi(this.D); this.da = !1 }; h.l = function () { this.da && this.la(); this.D && (this.D.m(), delete this.D); aj(this, function (a) { a.m() }); this.h && jc(this.h); this.U = this.h = this.qa = this.ra = null; Zi.o.l.call(this) }; function aj(a, b) { a.ra && Wa(a.ra, b, void 0) } h.removeChild = function (a, b) {
            if (a) {
                var c = m(a) ? a : a.Na || (a.Na = ":" + (a.mb.a++).toString(36)); this.qa && c ? (a = this.qa, a = (null !== a && c in a ? a[c] : void 0) || null) : a = null; if (c && a) {
                    var d = this.qa; c in d && delete d[c];
                    cb(this.ra, a); b && (a.la(), a.h && jc(a.h)); b = a; if (null == b) throw Error("Unable to set parent component"); b.U = null; Zi.o.Ka.call(b, null)
                }
            } if (!a) throw Error("Child is not in parent component"); return a
        }; function M(a, b) { var c = lc(a, "firebaseui-textfield"); b ? (pi(a, "firebaseui-input-invalid"), oi(a, "firebaseui-input"), c && pi(c, "firebaseui-textfield-invalid")) : (pi(a, "firebaseui-input"), oi(a, "firebaseui-input-invalid"), c && oi(c, "firebaseui-textfield-invalid")) } function bj(a, b, c) {
            b = new Hi(b); Ld(a, Ea(Md, b)); $i(a).Z(b,
                "input", c)
        } function cj(a, b, c) { b = new Ki(b); Ld(a, Ea(Md, b)); $i(a).Z(b, "key", function (a) { 13 == a.keyCode && (a.stopPropagation(), a.preventDefault(), c(a)) }) } function dj(a, b, c) { b = new Ai(b); Ld(a, Ea(Md, b)); $i(a).Z(b, "focusin", c) } function ej(a, b, c) { b = new Ai(b); Ld(a, Ea(Md, b)); $i(a).Z(b, "focusout", c) } function fj(a, b, c) { b = new vi(b); Ld(a, Ea(Md, b)); $i(a).Z(b, "action", function (a) { a.stopPropagation(); a.preventDefault(); c(a) }) } function gj(a) { oi(a, "firebaseui-hidden") } function N(a, b) { b && kc(a, b); pi(a, "firebaseui-hidden") }
        function hj(a) { return !ni(a, "firebaseui-hidden") && "none" != a.style.display } function ij(a) {
            a = a || {}; var b = a.email, c = a.disabled, d = '<div class="firebaseui-textfield mdl-textfield mdl-js-textfield mdl-textfield--floating-label"><label class="mdl-textfield__label firebaseui-label" for="email">'; d = a.Ob ? d + "Saisissez une nouvelle adresse e-mail" : d + "E-mail"; d += '</label><input type="email" name="email" autocomplete="username" class="mdl-textfield__input firebaseui-input firebaseui-id-email" value="' + od(null !=
                b ? b : "") + '"' + (c ? "disabled" : "") + '></div><div class="firebaseui-error-wrapper"><p class="firebaseui-error firebaseui-text-input-error firebaseui-hidden firebaseui-id-email-error"></p></div>'; return z(d)
        } function jj(a) { a = a || {}; a = a.label; var b = '<button type="submit" class="firebaseui-id-submit firebaseui-button mdl-button mdl-js-button mdl-button--raised mdl-button--colored">'; b = a ? b + y(a) : b + "Suivant"; return z(b + "</button>") } function kj() { var a = "" + jj({ label: md("Se connecter") }); return z(a) } function lj() {
            var a =
                "" + jj({ label: md("Enregistrer") }); return z(a)
        } function mj() { var a = "" + jj({ label: md("Continuer") }); return z(a) } function nj(a) { a = a || {}; a = a.label; var b = '<div class="firebaseui-new-password-component"><div class="firebaseui-textfield mdl-textfield mdl-js-textfield mdl-textfield--floating-label"><label class="mdl-textfield__label firebaseui-label" for="newPassword">'; b = a ? b + y(a) : b + "Choisissez un mot de passe"; return z(b + '</label><input type="password" name="newPassword" autocomplete="new-password" class="mdl-textfield__input firebaseui-input firebaseui-id-new-password"></div><a href="javascript:void(0)" class="firebaseui-input-floating-button firebaseui-id-password-toggle firebaseui-input-toggle-on firebaseui-input-toggle-blur"></a><div class="firebaseui-error-wrapper"><p class="firebaseui-error firebaseui-text-input-error firebaseui-hidden firebaseui-id-new-password-error"></p></div></div>') }
        function oj() { var a = {}; var b = '<div class="firebaseui-textfield mdl-textfield mdl-js-textfield mdl-textfield--floating-label"><label class="mdl-textfield__label firebaseui-label" for="password">'; b = a.current ? b + "Mot de passe actuel" : b + "Mot de passe"; return z(b + '</label><input type="password" name="password" autocomplete="current-password" class="mdl-textfield__input firebaseui-input firebaseui-id-password"></div><div class="firebaseui-error-wrapper"><p class="firebaseui-error firebaseui-text-input-error firebaseui-hidden firebaseui-id-password-error"></p></div>') }
        function pj() { return z('<a class="firebaseui-link firebaseui-id-secondary-link" href="javascript:void(0)">Vous ne parvenez pas \u00e0 vous connecter\u00a0?</a>') } function qj() { return z('<button class="firebaseui-id-secondary-link firebaseui-button mdl-button mdl-js-button mdl-button--primary">Annuler</button>') } function rj(a) {
            a = "" + ('<div class="firebaseui-info-bar firebaseui-id-info-bar"><p class="firebaseui-info-bar-message">' + y(a.message) + '&nbsp;&nbsp;<a href="javascript:void(0)" class="firebaseui-link firebaseui-id-dismiss-info-bar">Ignorer</a></p></div>');
            return z(a)
        } rj.a = "firebaseui.auth.soy2.element.infoBar"; function sj(a) { var b = a.content; a = a.$a; return z('<dialog class="mdl-dialog firebaseui-dialog firebaseui-id-dialog' + (a ? " " + od(a) : "") + '">' + y(b) + "</dialog>") } function tj(a) { var b = a.message; return z(sj({ content: nd('<div class="firebaseui-dialog-icon-wrapper"><div class="' + od(a.Ba) + ' firebaseui-dialog-icon"></div></div><div class="firebaseui-progress-dialog-message">' + y(b) + "</div>") })) } tj.a = "firebaseui.auth.soy2.element.progressDialog"; function uj(a) {
            var b =
                '<div class="firebaseui-list-box-actions">'; a = a.items; for (var c = a.length, d = 0; d < c; d++) { var e = a[d]; b += '<button type="button" data-listboxid="' + od(e.id) + '" class="mdl-button firebaseui-id-list-box-dialog-button firebaseui-list-box-dialog-button">' + (e.Ba ? '<div class="firebaseui-list-box-icon-wrapper"><div class="firebaseui-list-box-icon ' + od(e.Ba) + '"></div></div>' : "") + '<div class="firebaseui-list-box-label-wrapper">' + y(e.label) + "</div></button>" } b = "" + sj({
                    $a: md("firebaseui-list-box-dialog"), content: nd(b +
                        "</div>")
                }); return z(b)
        } uj.a = "firebaseui.auth.soy2.element.listBoxDialog"; function vj() { return z('<div class="mdl-progress mdl-js-progress mdl-progress__indeterminate firebaseui-busy-indicator firebaseui-id-busy-indicator"></div>') } vj.a = "firebaseui.auth.soy2.element.busyIndicator"; function wj(a) { a = a || {}; var b = ""; switch (a.providerId) { case "google.com": b += "Google"; break; case "github.com": b += "GitHub"; break; case "facebook.com": b += "Facebook"; break; case "twitter.com": b += "Twitter"; break; default: b += "Mot de passe" }return A(b) }
        function xj(a) { yj(a, "upgradeElement") } function zj(a) { yj(a, "downgradeElements") } var Aj = ["mdl-js-textfield", "mdl-js-progress", "mdl-js-spinner", "mdl-js-button"]; function yj(a, b) { a && window.componentHandler && window.componentHandler[b] && Wa(Aj, function (c) { if (ni(a, c)) window.componentHandler[b](a); Wa(dc(c, a), function (a) { window.componentHandler[b](a) }) }) } function Bj(a, b, c) {
            Cj.call(this); document.body.appendChild(a); a.showModal || window.dialogPolyfill.registerDialog(a); a.showModal(); xj(a); b && fj(this, a, function (b) {
                var c =
                    a.getBoundingClientRect(); (b.clientX < c.left || c.left + c.width < b.clientX || b.clientY < c.top || c.top + c.height < b.clientY) && Cj.call(this)
            }); if (!c) {
                var d = this.K().parentElement || this.K().parentNode; if (d) {
                    var e = this; this.V = function () {
                        if (a.open) {
                            var b = a.getBoundingClientRect().height, c = d.getBoundingClientRect().height, k = d.getBoundingClientRect().top - document.body.getBoundingClientRect().top, q = d.getBoundingClientRect().left - document.body.getBoundingClientRect().left, O = a.getBoundingClientRect().width, ya = d.getBoundingClientRect().width;
                            a.style.top = (k + (c - b) / 2).toString() + "px"; b = q + (ya - O) / 2; a.style.left = b.toString() + "px"; a.style.right = (document.body.getBoundingClientRect().width - b - O).toString() + "px"
                        } else window.removeEventListener("resize", e.V)
                    }; this.V(); window.addEventListener("resize", this.V, !1)
                }
            }
        } function Cj() { var a = Dj.call(this); a && (zj(a), a.open && a.close(), jc(a), this.V && window.removeEventListener("resize", this.V)) } function Dj() { return fc("firebaseui-id-dialog") } function Ej() { jc(Fj.call(this)) } function Fj() { return L(this, "firebaseui-id-info-bar") }
        function Gj() { return L(this, "firebaseui-id-dismiss-info-bar") } var Hj = { kb: "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg", ib: "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/github.svg", gb: "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/facebook.svg", Bb: "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/twitter.svg", ob: "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/mail.svg", qb: "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/phone.svg" };
        function Jj(a, b, c) { Rd.call(this, a, b); for (var d in c) this[d] = c[d] } t(Jj, Rd); function P(a, b, c, d) { Zi.call(this, c); this.Qa = a; this.Pa = b; this.sa = !1; this.Oa = d || null; this.u = this.$ = null } t(P, Zi); P.prototype.Ua = function () { var a = Zc(this.Qa, this.Pa, Hj, this.v); xj(a); this.h = a }; P.prototype.w = function () { P.o.w.call(this); ve(Q(this), new Jj("pageEnter", Q(this), { pageId: this.Oa })) }; P.prototype.la = function () { ve(Q(this), new Jj("pageExit", Q(this), { pageId: this.Oa })); P.o.la.call(this) }; P.prototype.l = function () {
            window.clearTimeout(this.$);
            this.Pa = this.Qa = this.$ = null; this.sa = !1; this.u = null; zj(this.K()); P.o.l.call(this)
        }; function Kj(a) { a.sa = !0; a.$ = window.setTimeout(function () { a.K() && null === a.u && (a.u = Zc(vj, null, null, a.v), a.K().appendChild(a.u), xj(a.u)) }, 500) } function Lj(a, b, c, d, e) { function f() { if (a.J) return null; a.sa = !1; window.clearTimeout(a.$); a.$ = null; a.u && (zj(a.u), jc(a.u), a.u = null) } if (a.sa) return null; Kj(a); return b.apply(null, c).then(d, e).then(f, f) } function Q(a) { return a.K().parentElement || a.K().parentNode } function Mj(a, b, c) {
            cj(a,
                b, function () { c.focus() })
        } function Nj(a, b, c) { cj(a, b, function () { c() }) } p(P.prototype, { g: function (a) { Ej.call(this); var b = Zc(rj, { message: a }, null, this.v); this.K().appendChild(b); fj(this, Gj.call(this), function () { jc(b) }) }, Nb: Ej, Tb: Fj, Sb: Gj, ua: function (a, b) { a = Zc(tj, { Ba: a, message: b }, null, this.v); Bj.call(this, a) }, j: Cj, Rb: Dj }); function Oj(a) {
            a = a || {}; var b = a.bb; a = "" + ('<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-sign-in"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Se connecter avec une adresse e-mail</h1></div><div class="firebaseui-card-content"><div class="firebaseui-relative-wrapper">' +
                ij(a) + '</div></div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' + (b ? qj() : "") + jj(null) + "</div></div></form></div>"); return z(a)
        } Oj.a = "firebaseui.auth.soy2.page.signIn"; function Pj(a) {
            a = "" + ('<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-password-sign-in"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Se connecter</h1></div><div class="firebaseui-card-content">' + ij(a) + oj() + '</div><div class="firebaseui-card-actions"><div class="firebaseui-form-links">' +
                pj() + '</div><div class="firebaseui-form-actions">' + kj() + "</div></div></form></div>"); return z(a)
        } Pj.a = "firebaseui.auth.soy2.page.passwordSignIn"; function Qj(a) {
            a = a || {}; var b = a.sb, c = a.pa, d = a.Ga, e = '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-password-sign-up"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Cr\u00e9er un compte</h1></div><div class="firebaseui-card-content">' + ij(a); b ? (b = a || {}, b = b.name, b = "" + ('<div class="firebaseui-textfield mdl-textfield mdl-js-textfield mdl-textfield--floating-label"><label class="mdl-textfield__label firebaseui-label" for="name">Nom et pr\u00e9nom</label><input type="text" name="name" autocomplete="name" class="mdl-textfield__input firebaseui-input firebaseui-id-name" value="' +
                od(null != b ? b : "") + '"></div><div class="firebaseui-error-wrapper"><p class="firebaseui-error firebaseui-text-input-error firebaseui-hidden firebaseui-id-name-error"></p></div>'), b = z(b)) : b = ""; e = e + b + nj(null); c ? (a = a || {}, a = "En appuyant sur ENREGISTRER, vous acceptez les " + ('<a href="' + od(td(a.pa)) + '" class="firebaseui-link" target="_blank">Conditions d\'utilisation</a>'), a = z("" + ('<p class="firebaseui-tos">' + a + "</p>"))) : a = ""; d = "" + (e + a + '</div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' +
                    (d ? qj() : "") + lj() + "</div></div></form></div>"); return z(d)
        } Qj.a = "firebaseui.auth.soy2.page.passwordSignUp"; function Rj(a) {
            a = a || {}; var b = a.Ga; a = "" + ('<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-password-recovery"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">R\u00e9cup\u00e9rer votre mot de passe</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">Les instructions relatives \u00e0 la r\u00e9initialisation de votre mot de passe seront envoy\u00e9es \u00e0 cette adresse e-mail</p>' +
                ij(a) + '</div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' + (b ? qj() : "") + jj({ label: md("Envoyer") }) + "</div></div></form></div>"); return z(a)
        } Rj.a = "firebaseui.auth.soy2.page.passwordRecovery"; function Sj(a) {
            var b = a.N, c = ""; a = "Suivez les instructions envoy\u00e9es \u00e0 l'adresse <strong>" + (y(a.email) + "</strong> pour r\u00e9cup\u00e9rer votre mot de passe"); c += '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-password-recovery-email-sent"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Consultez votre bo\u00eete de r\u00e9ception</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">' +
                a + '</p></div><div class="firebaseui-card-actions">'; b && (c += '<div class="firebaseui-form-actions">' + jj({ label: md("OK") }) + "</div>"); return z(c + "</div></div>")
        } Sj.a = "firebaseui.auth.soy2.page.passwordRecoveryEmailSent"; function Tj(a, b, c) { return z('<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-callback"><div class="firebaseui-callback-indicator-container">' + vj(null, null, c) + "</div></div>") } Tj.a = "firebaseui.auth.soy2.page.callback"; function Uj(a) {
            var b = ""; a = "Vous avez d\u00e9j\u00e0 utilis\u00e9 l'adresse <strong>" +
                (y(a.email) + "</strong> pour vous connecter. Saisissez le mot de passe pour ce compte."); b += '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-password-linking"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Se connecter</h1></div><div class="firebaseui-card-content"><h2 class="firebaseui-subtitle">Vous avez d\u00e9j\u00e0 un compte</h2><p class="firebaseui-text">' + a + "</p>" + oj() + '</div><div class="firebaseui-card-actions"><div class="firebaseui-form-links">' +
                    pj() + '</div><div class="firebaseui-form-actions">' + kj() + "</div></div></form></div>"; return z(b)
        } Uj.a = "firebaseui.auth.soy2.page.passwordLinking"; function Vj(a) {
            var b = a.email, c = ""; a = "" + wj(a); a = md(a); b = "Vous avez d\u00e9j\u00e0 utilis\u00e9 l'adresse <strong>" + (y(b) + ("</strong>. Connectez-vous avec " + (y(a) + " pour continuer."))); c += '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-federated-linking"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Se connecter</h1></div><div class="firebaseui-card-content"><h2 class="firebaseui-subtitle">Vous avez d\u00e9j\u00e0 un compte</h2><p class="firebaseui-text">' +
                b + '</p></div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' + jj({ label: md("Se connecter avec " + a) }) + "</div></div></form></div>"; return z(c)
        } Vj.a = "firebaseui.auth.soy2.page.federatedLinking"; function Wj(a) {
            var b = "", c = '<p class="firebaseui-text">pour <strong>' + (y(a.email) + "</strong></p>"); b += '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-password-reset"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">R\u00e9initialiser votre mot de passe</h1></div><div class="firebaseui-card-content">' +
                c + nj(ld(a)) + '</div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' + lj() + "</div></div></form></div>"; return z(b)
        } Wj.a = "firebaseui.auth.soy2.page.passwordReset"; function Xj(a) {
            a = a || {}; a = "" + ('<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-password-reset-success"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Le mot de passe a bien \u00e9t\u00e9 modifi\u00e9</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">Vous pouvez maintenant vous connecter avec votre nouveau mot de passe</p></div><div class="firebaseui-card-actions">' +
                (a.N ? '<div class="firebaseui-form-actions">' + mj() + "</div>" : "") + "</div></div>"); return z(a)
        } Xj.a = "firebaseui.auth.soy2.page.passwordResetSuccess"; function Yj(a) {
            a = a || {}; a = "" + ('<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-password-reset-failure"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Essayez de r\u00e9initialiser votre mot de passe</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">Votre demande de r\u00e9initialisation du mot de passe a expir\u00e9 ou ce lien a d\u00e9j\u00e0 \u00e9t\u00e9 utilis\u00e9</p></div><div class="firebaseui-card-actions">' +
                (a.N ? '<div class="firebaseui-form-actions">' + jj(null) + "</div>" : "") + "</div></div>"); return z(a)
        } Yj.a = "firebaseui.auth.soy2.page.passwordResetFailure"; function Zj(a) {
            var b = a.N, c = ""; a = "Votre adresse e-mail de connexion est de nouveau la suivante\u00a0: <strong>" + (y(a.email) + "</strong>."); c += '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-email-change-revoke-success"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">L\'adresse e-mail a bien \u00e9t\u00e9 mise \u00e0 jour</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">' +
                a + '</p><p class="firebaseui-text">Si vous n\'avez pas demand\u00e9 \u00e0 modifier l\'adresse de connexion, il se peut que quelqu\'un tente d\'acc\u00e9der \u00e0 votre compte. Vous devriez <a class="firebaseui-link firebaseui-id-reset-password-link" href="javascript:void(0)">modifier imm\u00e9diatement votre mot de passe</a>.</p></div><div class="firebaseui-card-actions">' + (b ? '<div class="firebaseui-form-actions">' + jj(null) + "</div>" : "") + "</div></form></div>"; return z(c)
        } Zj.a = "firebaseui.auth.soy2.page.emailChangeRevokeSuccess";
        function ak(a) {
            a = a || {}; a = "" + ('<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-email-change-revoke-failure"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Impossible de mettre \u00e0 jour votre adresse e-mail</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">Un probl\u00e8me est survenu lors du r\u00e9tablissement de votre adresse e-mail de connexion.</p><p class="firebaseui-text">Si l\'op\u00e9ration \u00e9choue \u00e0 nouveau lors de votre prochaine tentative, contactez votre administrateur.</p></div><div class="firebaseui-card-actions">' +
                (a.N ? '<div class="firebaseui-form-actions">' + jj(null) + "</div>" : "") + "</div></div>"); return z(a)
        } ak.a = "firebaseui.auth.soy2.page.emailChangeRevokeFailure"; function bk(a) {
            a = a || {}; a = "" + ('<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-email-verification-success"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Votre adresse e-mail a bien \u00e9t\u00e9 valid\u00e9e</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">Vous pouvez maintenant vous connecter avec votre nouveau compte</p></div><div class="firebaseui-card-actions">' +
                (a.N ? '<div class="firebaseui-form-actions">' + mj() + "</div>" : "") + "</div></div>"); return z(a)
        } bk.a = "firebaseui.auth.soy2.page.emailVerificationSuccess"; function ck(a) {
            a = a || {}; a = "" + ('<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-email-verification-failure"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Essayez de valider \u00e0 nouveau votre adresse e-mail</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">Votre demande de validation de l\'adresse e-mail a expir\u00e9, ou ce lien a d\u00e9j\u00e0 \u00e9t\u00e9 utilis\u00e9</p></div><div class="firebaseui-card-actions">' +
                (a.N ? '<div class="firebaseui-form-actions">' + jj(null) + "</div>" : "") + "</div></div>"); return z(a)
        } ck.a = "firebaseui.auth.soy2.page.emailVerificationFailure"; function dk(a) { a = "" + ('<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-unrecoverable-error"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Une erreur s\'est produite</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">' + y(a.fb) + "</p></div></div>"); return z(a) } dk.a = "firebaseui.auth.soy2.page.unrecoverableError";
        function ek(a) {
            var b = a.pb, c = ""; a = "Souhaitez-vous continuer avec l'adresse " + (y(a.Cb) + "\u00a0?"); b = "Initialement, vous souhaitiez vous connecter avec l'adresse " + y(b); c += '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-email-mismatch"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Se connecter</h1></div><div class="firebaseui-card-content"><h2 class="firebaseui-subtitle">' + a + '</h2><p class="firebaseui-text">' + b + '</p></div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' +
                qj() + jj({ label: md("Continuer") }) + "</div></div></form></div>"; return z(c)
        } ek.a = "firebaseui.auth.soy2.page.emailMismatch"; function fk(a, b, c) {
            var d = '<div class="firebaseui-container firebaseui-page-provider-sign-in firebaseui-id-page-provider-sign-in"><div class="firebaseui-card-content"><form onsubmit="return false;"><ul class="firebaseui-idp-list">'; a = a.rb; b = a.length; for (var e = 0; e < b; e++) {
                var f = { providerId: a[e] }; var g = c, k = f.providerId, q = f; q = q || {}; var O = ""; switch (q.providerId) {
                    case "google.com": O += "firebaseui-idp-google";
                        break; case "github.com": O += "firebaseui-idp-github"; break; case "facebook.com": O += "firebaseui-idp-facebook"; break; case "twitter.com": O += "firebaseui-idp-twitter"; break; case "phone": O += "firebaseui-idp-phone"; break; default: O += "firebaseui-idp-password"
                }q = '<button class="firebaseui-idp-button mdl-button mdl-js-button mdl-button--raised ' + od(A(O)) + ' firebaseui-id-idp-button" data-provider-id="' + od(k) + '"><span class="firebaseui-idp-icon-wrapper"><img class="firebaseui-idp-icon" alt="" src="'; O = (O = f) || {}; var ya =
                    ""; switch (O.providerId) { case "google.com": ya += td(g.kb); break; case "github.com": ya += td(g.ib); break; case "facebook.com": ya += td(g.gb); break; case "twitter.com": ya += td(g.Bb); break; case "phone": ya += td(g.qb); break; default: ya += td(g.ob) }g = kd(ya); q = q + od(td(g)) + '"></span>'; "password" == k ? q += '<span class="firebaseui-idp-text firebaseui-idp-text-long">Se connecter avec une adresse e-mail</span><span class="firebaseui-idp-text firebaseui-idp-text-short">E-mail</span>' : "phone" == k ? q += '<span class="firebaseui-idp-text firebaseui-idp-text-long">Se connecter avec un t\u00e9l\u00e9phone</span><span class="firebaseui-idp-text firebaseui-idp-text-short">T\u00e9l\u00e9phone</span>' :
                        (k = "Se connecter avec " + y(wj(f)), q += '<span class="firebaseui-idp-text firebaseui-idp-text-long">' + k + '</span><span class="firebaseui-idp-text firebaseui-idp-text-short">' + y(wj(f)) + "</span>"); f = z(q + "</button>"); d += '<li class="firebaseui-list-item">' + f + "</li>"
            } return z(d + "</ul></form></div></div>")
        } fk.a = "firebaseui.auth.soy2.page.providerSignIn"; function gk(a) {
            a = a || {}; var b = a.eb; a = a || {}; a = a.na; a = "" + ('<div class="firebaseui-phone-number"><button class="firebaseui-id-country-selector firebaseui-country-selector mdl-button mdl-js-button"><span class="firebaseui-flag firebaseui-country-selector-flag firebaseui-id-country-selector-flag"></span><span class="firebaseui-id-country-selector-code"></span></button><div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label firebaseui-textfield firebaseui-phone-input-wrapper"><label class="mdl-textfield__label firebaseui-label" for="phoneNumber">Num\u00e9ro de t\u00e9l\u00e9phone</label><input type="tel" name="phoneNumber" class="mdl-textfield__input firebaseui-input firebaseui-id-phone-number" value="' +
                od(null != a ? a : "") + '"></div></div><div class="firebaseui-error-wrapper"><p class="firebaseui-error firebaseui-text-input-error firebaseui-hidden firebaseui-phone-number-error firebaseui-id-phone-number-error"></p></div>'); a = '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-phone-sign-in-start"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Saisissez votre num\u00e9ro de t\u00e9l\u00e9phone</h1></div><div class="firebaseui-card-content"><div class="firebaseui-relative-wrapper">' +
                    z(a); b = b ? z('<div class="firebaseui-recaptcha-wrapper"><div class="firebaseui-recaptcha-container"></div><div class="firebaseui-error-wrapper firebaseui-recaptcha-error-wrapper"><p class="firebaseui-error firebaseui-hidden firebaseui-id-recaptcha-error"></p></div></div>') : ""; b = a + b + '</div></div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' + qj() + jj({ label: md("Valider") }) + '</div></div><div class="firebaseui-card-footer">'; a = z('<p class="firebaseui-tos">En appuyant sur "Valider", vous d\u00e9clencherez peut-\u00eatre l\'envoi d\'un SMS. Des frais de messages et de donn\u00e9es peuvent \u00eatre factur\u00e9s.</p>');
            return z("" + (b + a + "</div></form></div>"))
        } gk.a = "firebaseui.auth.soy2.page.phoneSignInStart"; function hk(a) {
            a = a || {}; var b = a.phoneNumber, c = a.pa, d = "", e = 'Saisissez le code \u00e0 six\u00a0chiffres envoy\u00e9 au <a class="firebaseui-link firebaseui-change-phone-number-link firebaseui-id-change-phone-number-link" href="javascript:void(0)">&lrm;' + (y(b) + "</a>"); y(b); b = d; d = z('<div class="firebaseui-textfield mdl-textfield mdl-js-textfield mdl-textfield--floating-label"><label class="mdl-textfield__label firebaseui-label" for="phoneConfirmationCode">Code \u00e0 six\u00a0chiffres</label><input type="number" name="phoneConfirmationCode" class="mdl-textfield__input firebaseui-input firebaseui-id-phone-confirmation-code"></div><div class="firebaseui-error-wrapper"><p class="firebaseui-error firebaseui-text-input-error firebaseui-hidden firebaseui-id-phone-confirmation-code-error"></p></div>');
            e = '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-phone-sign-in-finish"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Validez votre num\u00e9ro de t\u00e9l\u00e9phone</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">' + e + "</p>" + d + '</div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' + qj() + jj({ label: md("Continuer") }) + "</div></div>"; c ? (a = a || {}, a = 'En appuyant sur "Continuer", vous indiquez que vous acceptez les ' +
                ('<a href="' + od(td(a.pa)) + '" class="firebaseui-link" target="_blank">Conditions d\'utilisation</a>'), a = '<div class="firebaseui-card-footer">' + z("" + ('<p class="firebaseui-tos">' + a + "</p>")) + "</div>") : a = ""; a = e + a + "</form>"; c = z('<div class="firebaseui-resend-container"><span class="firebaseui-id-resend-countdown"></span><a href="javascript:void(0)" class="firebaseui-id-resend-link firebaseui-hidden firebaseui-link">Renvoyer</a></div>'); return z(b + (a + c + "</div>"))
        } hk.a = "firebaseui.auth.soy2.page.phoneSignInFinish";
        function ik() { return L(this, "firebaseui-id-submit") } function jk() { return L(this, "firebaseui-id-secondary-link") } function kk(a, b) { fj(this, ik.call(this), function (b) { a(b) }); var c = jk.call(this); c && b && fj(this, c, function (a) { b(a) }) } function lk() { return L(this, "firebaseui-id-password") } function mk() { return L(this, "firebaseui-id-password-error") } function nk() { var a = lk.call(this), b = mk.call(this); bj(this, a, function () { hj(b) && (M(a, !0), gj(b)) }) } function ok() {
            var a = lk.call(this); var b = mk.call(this); K(a) ? (M(a, !0),
                gj(b), b = !0) : (M(a, !1), N(b, Bd().toString()), b = !1); return b ? K(a) : null
        } function pk(a, b, c, d) { P.call(this, Uj, { email: a }, d, "passwordLinking"); this.a = b; this.I = c } t(pk, P); pk.prototype.w = function () { this.M(); this.L(this.a, this.I); Nj(this, this.i(), this.a); this.i().focus(); pk.o.w.call(this) }; pk.prototype.l = function () { this.a = null; pk.o.l.call(this) }; pk.prototype.G = function () { return K(L(this, "firebaseui-id-email")) }; p(pk.prototype, { i: lk, C: mk, M: nk, B: ok, aa: ik, W: jk, L: kk }); var qk = /^[+a-zA-Z0-9_.!#$%&'*\/=?^`{|}~-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,63}$/;
        function rk() { return L(this, "firebaseui-id-email") } function sk() { return L(this, "firebaseui-id-email-error") } function tk(a) { var b = rk.call(this), c = sk.call(this); bj(this, b, function () { hj(c) && (M(b, !0), gj(c)) }); a && cj(this, b, function () { a() }) } function uk() { return Ja(K(rk.call(this)) || "") } function vk() {
            var a = rk.call(this); var b = sk.call(this); var c = K(a) || ""; c ? qk.test(c) ? (M(a, !0), gj(b), b = !0) : (M(a, !1), N(b, A("Cette adresse e-mail n'est pas valide").toString()), b = !1) : (M(a, !1), N(b, A("Saisissez votre adresse e-mail pour continuer").toString()),
                b = !1); return b ? Ja(K(a)) : null
        } function wk(a, b, c, d) { P.call(this, Pj, { email: c }, d, "passwordSignIn"); this.a = a; this.I = b } t(wk, P); wk.prototype.w = function () { this.M(); this.aa(); this.W(this.a, this.I); Mj(this, this.s(), this.i()); Nj(this, this.i(), this.a); K(this.s()) ? this.i().focus() : this.s().focus(); wk.o.w.call(this) }; wk.prototype.l = function () { this.I = this.a = null; wk.o.l.call(this) }; p(wk.prototype, { s: rk, T: sk, M: tk, L: uk, G: vk, i: lk, C: mk, aa: nk, B: ok, wa: ik, va: jk, W: kk }); function R(a, b, c, d, e) {
            P.call(this, a, b, d, e || "notice");
            this.a = c || null
        } t(R, P); R.prototype.w = function () { this.a && (this.s(this.a), this.i().focus()); R.o.w.call(this) }; R.prototype.l = function () { this.a = null; R.o.l.call(this) }; p(R.prototype, { i: ik, B: jk, s: kk }); function xk(a, b, c) { R.call(this, Sj, { email: a, N: !!b }, b, c, "passwordRecoveryEmailSent") } t(xk, R); function yk(a, b) { R.call(this, bk, { N: !!a }, a, b, "emailVerificationSuccess") } t(yk, R); function zk(a, b) { R.call(this, ck, { N: !!a }, a, b, "emailVerificationFailure") } t(zk, R); function Ak(a, b) { R.call(this, Xj, { N: !!a }, a, b, "passwordResetSuccess") }
        t(Ak, R); function Bk(a, b) { R.call(this, Yj, { N: !!a }, a, b, "passwordResetFailure") } t(Bk, R); function Ck(a, b) { R.call(this, ak, { N: !!a }, a, b, "emailChangeRevokeFailure") } t(Ck, R); function Dk(a, b) { R.call(this, dk, { fb: a }, void 0, b, "unrecoverableError") } t(Dk, R); var Ek = !1, Fk = null; function Gk(a, b) { Ek = !!b; Fk || ("undefined" == typeof accountchooser && li() ? (b = Ob(Jb(Kb("//www.gstatic.com/accountchooser/client.js"))), Fk = af(E(zf(b)), function () { })) : Fk = E()); Fk.then(a, a) } function Hk(a, b) {
            a = S(a); (a = Oh(a).accountChooserInvoked || null) ?
                a(b) : b()
        } function Ik(a, b, c) { a = S(a); (a = Oh(a).accountChooserResult || null) ? a(b, c) : c() } function Jk(a, b, c, d, e) { d ? (H("callback", a, b), Ek && c()) : Hk(a, function () { Yg(T(a)); Wh(function (d) { F(Mg, T(a)); Ik(a, d ? "empty" : "unavailable", function () { H("signIn", a, b); (d || Ek) && c() }) }, Vg(T(a)), e) }) } function Kk(a, b, c, d) { function e(a) { a = U(a); V(b, c, void 0, a); d() } Ik(b, "accountSelected", function () { Ug(!1, T(b)); W(b, X(b).fetchProvidersForEmail(a.a).then(function (e) { Lk(b, c, e, a.a, a.h || void 0); d() }, e)) }) } function Mk(a, b, c, d) {
            Ik(b, a ? "addAccount" :
                "unavailable", function () { H("signIn", b, c); (a || Ek) && d() })
        } function Nk(a, b, c, d) { function e() { var b = a(); b && (b = Nh(S(b))) && b() } Th(function () { var f = a(); f && Jk(f, b, e, c, d) }, function (c) { var d = a(); d && Kk(c, d, b, e) }, function (c) { var d = a(); d && Mk(c, d, b, e) }, a() && rh(S(a()))) } function Ok(a, b, c, d, e) {
            function f(c) {
                if (!c.name || "cancel" != c.name) if (Pk(c)) c = Q(b), b.m(), V(a, c, void 0, Dd().toString()); else {
                    var d = c && c.message || ""; if (c.code) {
                        if ("auth/email-already-in-use" == c.code || "auth/credential-already-in-use" == c.code) return;
                        d = U(c)
                    } b.g(d)
                }
            } if (e) return Qk(a, Rk(a).currentUser, c), E(); if (!c) throw Error("No credential found!"); var g = c; c.providerId && "password" == c.providerId && (g = null); d = X(a).currentUser || d || Rk(a).currentUser; if (!d) throw Error("User not logged in."); d = new mg(d.email, d.displayName, d.photoURL, g && g.providerId); null != Qg(Og, T(a)) && !Qg(Og, T(a)) || Wg(d, T(a)); F(Og, T(a)); c = Sk(a, c); d = c.then(function (b) { Qk(a, b, g) }, f).then(void 0, f); W(a, c); return E(d)
        } function Tk(a, b, c, d) {
            var e = Qh(S(a)); Ph(S(a)) && e && Vf && Uf("Both signInSuccess and signInSuccessWithAuthResult callbacks are provided. Only signInSuccessWithAuthResult callback will be invoked.");
            if (e) {
                if (d) return Uk(a, c), E(); if (!c.credential) throw Error("No credential found!"); d = function (c) { if (!c.name || "cancel" != c.name) if (Pk(c)) c = Q(b), b.m(), V(a, c, void 0, Dd().toString()); else { var d = c && c.message || ""; if (c.code) { if ("auth/email-already-in-use" == c.code || "auth/credential-already-in-use" == c.code) return; d = U(c) } b.g(d) } }; e = X(a).currentUser || c.user; if (!e) throw Error("User not logged in."); e = new mg(e.email, e.displayName, e.photoURL, "password" == c.credential.providerId ? null : c.credential.providerId); null !=
                    Qg(Og, T(a)) && !Qg(Og, T(a)) || Wg(e, T(a)); F(Og, T(a)); c = Vk(a, c); d = c.then(function (b) { Uk(a, b) }, d).then(void 0, d); W(a, c); return E(d)
            } return Ok(a, b, c.credential, c.user, d)
        } function Qk(a, b, c) { var d = Ph(S(a)), e = Sg(T(a)) || void 0; F(Ng, T(a)); var f = !1; if (mf()) { if (!d || d(b, c, e)) f = !0, window.opener.location.assign(Rb(Tb(Wk(a, e)))); d || window.close() } else if (!d || d(b, c, e)) f = !0, lf(Wk(a, e)); f || a.reset() } function Uk(a, b) {
            if (!b.user) throw Error("No user found"); var c = Qh(S(a)), d = Sg(T(a)) || void 0; F(Ng, T(a)); var e = !1; if (mf()) {
                if (!c ||
                    c(b, d)) e = !0, window.opener.location.assign(Rb(Tb(Wk(a, d)))); c || window.close()
            } else if (!c || c(b, d)) e = !0, lf(Wk(a, d)); e || a.reset()
        } function Wk(a, b) { a = b || S(a).a.get("signInSuccessUrl"); if (!a) throw Error("No redirect URL has been found. You must either specify a signInSuccessUrl in the configuration, pass in a redirect URL to the widget URL, or return false from the callback."); return a } function U(a) {
            var b = ""; switch (a.code) {
                case "auth/email-already-in-use": b += "L'adresse e-mail est d\u00e9j\u00e0 utilis\u00e9e par un autre compte";
                    break; case "auth/requires-recent-login": b += Fd(); break; case "auth/too-many-requests": b += "Vous avez saisi un mot de passe incorrect un trop grand nombre de fois. Veuillez r\u00e9essayer dans quelques minutes."; break; case "auth/user-cancelled": b += "Veuillez accorder les autorisations n\u00e9cessaires pour vous connecter \u00e0 l'application"; break; case "auth/user-not-found": b += "Cette adresse e-mail ne correspond \u00e0 aucun compte existant"; break; case "auth/user-token-expired": b += Fd(); break; case "auth/weak-password": b +=
                        "Les mots de passe s\u00e9curis\u00e9s comportent au moins six\u00a0caract\u00e8res et une combinaison de chiffres et de lettres"; break; case "auth/wrong-password": b += "L'adresse e-mail et le mot de passe saisis ne correspondent pas"; break; case "auth/network-request-failed": b += "Une erreur r\u00e9seau s'est produite"; break; case "auth/invalid-phone-number": b += zd(); break; case "auth/invalid-verification-code": b += Ad(); break; case "auth/code-expired": b += "Ce code n'est plus valide"
            }if (b = A(b).toString()) return b;
            try { return JSON.parse(a.message), lg("Internal error: " + a.message), Cd().toString() } catch (c) { return a.message }
        } function Pk(a) { a = a.message; try { var b = ((JSON.parse(a).error || {}).message || "").toLowerCase().match(/invalid.+(access|id)_token/); if (b && b.length) return !0 } catch (c) { } return !1 } function Xk(a, b, c) {
            var d = og[b] && firebase.auth[og[b]] ? new firebase.auth[og[b]] : null; if (!d) throw Error("Invalid Firebase Auth provider!"); var e = Gh(S(a), b); if (d && d.addScope) for (var f = 0; f < e.length; f++)d.addScope(e[f]); a = Hh(S(a),
                b); b == firebase.auth.GoogleAuthProvider.PROVIDER_ID && c && (a = a || {}, a.login_hint = c); a && d && d.setCustomParameters && d.setCustomParameters(a); return d
        } function Yk(a, b, c, d) {
            function e() { Yg(T(a)); W(a, Lj(b, n(a.zb, a), [q], function () { if ("file:" === (window.location && window.location.protocol)) return W(a, Zk(a).then(function (c) { b.m(); F(Mg, T(a)); H("callback", a, k, E(c)) }, f)) }, g)) } function f(c) {
                F(Mg, T(a)); if (!c.name || "cancel" != c.name) switch (c.code) {
                    case "auth/popup-blocked": e(); break; case "auth/popup-closed-by-user": case "auth/cancelled-popup-request": break;
                    case "auth/credential-already-in-use": break; case "auth/network-request-failed": case "auth/too-many-requests": case "auth/user-cancelled": b.g(U(c)); break; default: b.m(), H("callback", a, k, Ze(c))
                }
            } function g(c) { F(Mg, T(a)); c.name && "cancel" == c.name || (lg("signInWithRedirect: " + c.code), c = U(c), b.g(c)) } var k = Q(b), q = Xk(a, c, d); "redirect" == Mh(S(a)) ? e() : W(a, $k(a, q).then(function (c) { b.m(); H("callback", a, k, E(c)) }, f))
        } function al(a, b, c) {
            function d(c) {
                var d = !1; c = Lj(b, n(a.wb, a), [c], function (c) {
                    var e = Q(b); b.m(); H("callback",
                        a, e, E(c)); d = !0
                }, function (c) { if (!c.name || "cancel" != c.name) if (!c || "auth/credential-already-in-use" != c.code) if (c && "auth/email-already-in-use" == c.code && c.email && c.credential) { var d = Q(b); b.m(); H("callback", a, d, Ze(c)) } else c = U(c), b.g(c) }); W(a, c); return c.then(function () { return d }, function () { return !1 })
            } var e = Eh(S(a), c && c.authMethod || null); if (c && c.idToken && e === firebase.auth.GoogleAuthProvider.PROVIDER_ID) return Gh(S(a), firebase.auth.GoogleAuthProvider.PROVIDER_ID).length ? (Yk(a, b, e, c.id), c = E(!0)) : c = d(firebase.auth.GoogleAuthProvider.credential(c.idToken)),
                c; c && b.g(A("Les identifiants s\u00e9lectionn\u00e9s pour le fournisseur d'authentification ne sont pas compatibles.").toString()); return E(!1)
        } function bl(a, b) {
            var c = b.G(), d = b.B(); if (c) if (d) {
                var e = firebase.auth.EmailAuthProvider.credential(c, d); W(a, Lj(b, n(a.xb, a), [c, d], function (c) { return Tk(a, b, { user: c.user, credential: e, operationType: c.operationType, additionalUserInfo: c.additionalUserInfo }) }, function (a) {
                    if (!a.name || "cancel" != a.name) switch (a.code) {
                        case "auth/email-already-in-use": break; case "auth/email-exists": M(b.s(),
                            !1); N(b.T(), U(a)); break; case "auth/too-many-requests": case "auth/wrong-password": M(b.i(), !1); N(b.C(), U(a)); break; default: lg("verifyPassword: " + a.message), b.g(U(a))
                    }
                }))
            } else b.i().focus(); else b.s().focus()
        } function cl(a) { a = Bh(S(a)); return 1 == a.length && a[0] == firebase.auth.EmailAuthProvider.PROVIDER_ID } function dl(a) { a = Bh(S(a)); return 1 == a.length && a[0] == firebase.auth.PhoneAuthProvider.PROVIDER_ID } function V(a, b, c, d) {
            cl(a) ? d ? H("signIn", a, b, c, d) : el(a, b, c) : a && dl(a) && !d ? H("phoneSignInStart", a, b) : H("providerSignIn",
                a, b, d)
        } function fl(a, b, c, d) { var e = Q(b); W(a, Lj(b, n(X(a).fetchProvidersForEmail, X(a)), [c], function (f) { Ug(Dh(S(a)) == oh, T(a)); b.m(); Lk(a, e, f, c, void 0, d) }, function (a) { a = U(a); b.g(a) })) } function Lk(a, b, c, d, e, f) { if (c.length) if (bb(c, firebase.auth.EmailAuthProvider.PROVIDER_ID)) H("passwordSignIn", a, b, d); else { e = new pg(d); var g = T(a); Rg(Lg, e.fa(), g); H("federatedSignIn", a, b, d, c[0], f) } else H("passwordSignUp", a, b, d, e) } function el(a, b, c) {
        Dh(S(a)) == oh ? Gk(function () {
            Rh ? Hk(a, function () {
                Yg(T(a)); Wh(function (d) {
                    F(Mg, T(a));
                    Ik(a, d ? "empty" : "unavailable", function () { H("signIn", a, b, c) })
                }, Vg(T(a)), uh(S(a)))
            }) : (Y(a), Nk(gl, b, !1, uh(S(a))))
        }, !1) : (Ek = !1, Hk(a, function () { Ik(a, "unavailable", function () { H("signIn", a, b, c) }) }))
        } function hl(a) { var b = window.location.href; a = wh(S(a)); b = zc(b, a) || ""; for (var c in sh) if (sh[c].toLowerCase() == b.toLowerCase()) return sh[c]; return "callback" } function il(a) { var b = window.location.href; a = bh(S(a).a, "queryParameterForSignInSuccessUrl"); return (b = zc(b, a)) ? Rb(Tb(b)) : null } function jl() {
            return zc(window.location.href,
                "oobCode")
        } function kl() { var a = zc(window.location.href, "continueUrl"); return a ? function () { lf(a) } : null } function ll(a, b) {
            var c = nf(b); switch (hl(a)) {
                case "callback": (b = il(a)) && Tg(b, T(a)); H("callback", a, c); break; case "resetPassword": H("passwordReset", a, c, jl(), kl()); break; case "recoverEmail": H("emailChangeRevocation", a, c, jl()); break; case "verifyEmail": H("emailVerification", a, c, jl(), kl()); break; case "select": if ((b = il(a)) && Tg(b, T(a)), Rh) { V(a, c); break } else { Gk(function () { Y(a); Nk(gl, c, !0) }, !0); return } default: throw Error("Unhandled widget operation.");
            }(b = Nh(S(a))) && b()
        } function ml(a) { P.call(this, Tj, void 0, a, "callback") } t(ml, P); function nl(a, b, c) {
            if (c.user) { var d = { user: c.user, credential: c.credential, operationType: c.operationType, additionalUserInfo: c.additionalUserInfo }, e = Xg(T(a)), f = e && e.g; if (f && !ol(c.user, f)) pl(a, b, d); else { var g = e && e.a; g ? W(a, c.user.linkAndRetrieveDataWithCredential(g).then(function (c) { d = { user: c.user, credential: g, operationType: c.operationType, additionalUserInfo: c.additionalUserInfo }; ql(a, b, d) }, function (c) { rl(a, b, c) })) : ql(a, b, d) } } else c =
                Q(b), b.m(), F(Lg, T(a)), V(a, c)
        } function ql(a, b, c) { F(Lg, T(a)); Tk(a, b, c) } function rl(a, b, c) { var d = Q(b); F(Lg, T(a)); c = U(c); b.m(); V(a, d, void 0, c) } function sl(a, b, c, d) { var e = Q(b); W(a, X(a).fetchProvidersForEmail(c).then(function (f) { b.m(); f.length ? "password" == f[0] ? H("passwordLinking", a, e, c) : H("federatedLinking", a, e, c, f[0], d) : (F(Lg, T(a)), H("passwordRecovery", a, e, c, !1, Ed().toString())) }, function (c) { rl(a, b, c) })) } function pl(a, b, c) {
            var d = Q(b); W(a, tl(a).then(function () { b.m(); H("emailMismatch", a, d, c) }, function (a) {
            a.name &&
                "cancel" == a.name || (a = U(a.code), b.g(a))
            }))
        } function ol(a, b) { if (b == a.email) return !0; if (a.providerData) for (var c = 0; c < a.providerData.length; c++)if (b == a.providerData[c].email) return !0; return !1 } G.callback = function (a, b, c) {
            var d = new ml; d.render(b); Z(a, d); b = c || Zk(a); W(a, b.then(function (b) { nl(a, d, b) }, function (b) {
                if (b && ("auth/account-exists-with-different-credential" == b.code || "auth/email-already-in-use" == b.code) && b.email && b.credential) { var c = qg(b), e = T(a); Rg(Lg, c.fa(), e); sl(a, d, b.email) } else b && "auth/user-cancelled" ==
                    b.code ? (c = Xg(T(a)), e = U(b), c && c.a ? sl(a, d, c.g, e) : c ? fl(a, d, c.g, e) : rl(a, d, b)) : b && "auth/credential-already-in-use" == b.code || (b && "auth/operation-not-supported-in-this-environment" == b.code && cl(a) ? nl(a, d, { user: null, credential: null }) : rl(a, d, b))
            }))
        }; function ul(a, b, c, d) { P.call(this, Zj, { email: a, N: !!c }, d, "emailChangeRevoke"); this.i = b; this.a = c || null } t(ul, P); ul.prototype.w = function () { var a = this; fj(this, L(this, "firebaseui-id-reset-password-link"), function () { a.i() }); this.a && (this.B(this.a), this.s().focus()); ul.o.w.call(this) };
        ul.prototype.l = function () { this.i = this.a = null; ul.o.l.call(this) }; p(ul.prototype, { s: ik, C: jk, B: kk }); function vl() { return L(this, "firebaseui-id-new-password") } function wl() { return L(this, "firebaseui-id-password-toggle") } function xl() { this.Ea = !this.Ea; var a = wl.call(this), b = vl.call(this); this.Ea ? (b.type = "text", oi(a, "firebaseui-input-toggle-off"), pi(a, "firebaseui-input-toggle-on")) : (b.type = "password", oi(a, "firebaseui-input-toggle-on"), pi(a, "firebaseui-input-toggle-off")); b.focus() } function yl() {
            return L(this,
                "firebaseui-id-new-password-error")
        } function zl() { this.Ea = !1; var a = vl.call(this); a.type = "password"; var b = yl.call(this); bj(this, a, function () { hj(b) && (M(a, !0), gj(b)) }); var c = wl.call(this); oi(c, "firebaseui-input-toggle-on"); pi(c, "firebaseui-input-toggle-off"); dj(this, a, function () { oi(c, "firebaseui-input-toggle-focus"); pi(c, "firebaseui-input-toggle-blur") }); ej(this, a, function () { oi(c, "firebaseui-input-toggle-blur"); pi(c, "firebaseui-input-toggle-focus") }); fj(this, c, n(xl, this)) } function Al() {
            var a = vl.call(this);
            var b = yl.call(this); K(a) ? (M(a, !0), gj(b), b = !0) : (M(a, !1), N(b, Bd().toString()), b = !1); return b ? K(a) : null
        } function Bl(a, b, c) { P.call(this, Wj, { email: a }, c, "passwordReset"); this.a = b } t(Bl, P); Bl.prototype.w = function () { this.G(); this.C(this.a); Nj(this, this.i(), this.a); this.i().focus(); Bl.o.w.call(this) }; Bl.prototype.l = function () { this.a = null; Bl.o.l.call(this) }; p(Bl.prototype, { i: vl, B: yl, I: wl, G: zl, s: Al, M: ik, L: jk, C: kk }); function Cl(a, b, c, d, e) {
            var f = c.s(); f && W(a, Lj(c, n(X(a).confirmPasswordReset, X(a)), [d, f], function () {
                c.m();
                var d = new Ak(e); d.render(b); Z(a, d)
            }, function (d) { Dl(a, b, c, d) }))
        } function Dl(a, b, c, d) { "auth/weak-password" == (d && d.code) ? (a = U(d), M(c.i(), !1), N(c.B(), a), c.i().focus()) : (c && c.m(), c = new Bk, c.render(b), Z(a, c)) } function El(a, b, c) {
            var d = new ul(c, function () { W(a, Lj(d, n(X(a).sendPasswordResetEmail, X(a)), [c], function () { d.m(); d = new xk(c); d.render(b); Z(a, d) }, function () { d.g(A("Impossible d'envoyer le code de r\u00e9initialisation du mot de passe \u00e0 l'adresse e-mail indiqu\u00e9e").toString()) })) }); d.render(b);
            Z(a, d)
        } G.passwordReset = function (a, b, c, d) { W(a, X(a).verifyPasswordResetCode(c).then(function (e) { var f = new Bl(e, function () { Cl(a, b, f, c, d) }); f.render(b); Z(a, f) }, function () { Dl(a, b) })) }; G.emailChangeRevocation = function (a, b, c) { var d = null; W(a, X(a).checkActionCode(c).then(function (b) { d = b.data.email; return X(a).applyActionCode(c) }).then(function () { El(a, b, d) }, function () { var c = new Ck; c.render(b); Z(a, c) })) }; G.emailVerification = function (a, b, c, d) {
            W(a, X(a).applyActionCode(c).then(function () {
                var c = new yk(d); c.render(b);
                Z(a, c)
            }, function () { var c = new zk; c.render(b); Z(a, c) }))
        }; function Fl(a, b, c, d, e) { P.call(this, ek, { Cb: a, pb: b }, e, "emailMismatch"); this.s = c; this.i = d } t(Fl, P); Fl.prototype.w = function () { this.C(this.s, this.i); this.B().focus(); Fl.o.w.call(this) }; Fl.prototype.l = function () { this.i = this.a = null; Fl.o.l.call(this) }; p(Fl.prototype, { B: ik, G: jk, C: kk }); G.emailMismatch = function (a, b, c) {
            var d = Xg(T(a)); if (d) {
                var e = new Fl(c.user.email, d.g, function () { var b = e; F(Lg, T(a)); Tk(a, b, c) }, function () {
                    var b = c.credential.providerId, g = Q(e);
                    e.m(); d.a ? H("federatedLinking", a, g, d.g, b) : H("federatedSignIn", a, g, d.g, b)
                }); e.render(b); Z(a, e)
            } else V(a, b)
        }; function Gl(a, b, c, d) { P.call(this, Vj, { email: a, providerId: b }, d, "federatedLinking"); this.a = c } t(Gl, P); Gl.prototype.w = function () { this.s(this.a); this.i().focus(); Gl.o.w.call(this) }; Gl.prototype.l = function () { this.a = null; Gl.o.l.call(this) }; p(Gl.prototype, { i: ik, s: kk }); G.federatedLinking = function (a, b, c, d, e) {
            var f = Xg(T(a)); if (f && f.a) { var g = new Gl(c, d, function () { Yk(a, g, d, c) }); g.render(b); Z(a, g); e && g.g(e) } else V(a,
                b)
        }; G.federatedSignIn = function (a, b, c, d, e) { var f = new Gl(c, d, function () { Yk(a, f, d, c) }); f.render(b); Z(a, f); e && f.g(e) }; function Hl(a, b, c, d) {
            var e = b.B(); e ? W(a, Lj(b, n(a.ub, a), [c, e], function (c) { c = c.user.linkAndRetrieveDataWithCredential(d).then(function (c) { return Tk(a, b, { user: c.user, credential: d, operationType: c.operationType, additionalUserInfo: c.additionalUserInfo }) }); W(a, c); return c }, function (a) {
                if (!a.name || "cancel" != a.name) switch (a.code) {
                    case "auth/wrong-password": M(b.i(), !1); N(b.C(), U(a)); break; case "auth/too-many-requests": b.g(U(a));
                        break; default: lg("signInWithEmailAndPassword: " + a.message), b.g(U(a))
                }
            })) : b.i().focus()
        } G.passwordLinking = function (a, b, c) { var d = Xg(T(a)); F(Lg, T(a)); var e = d && d.a; if (e) { var f = new pk(c, function () { Hl(a, f, c, e) }, function () { f.m(); H("passwordRecovery", a, b, c) }); f.render(b); Z(a, f) } else V(a, b) }; function Il(a, b, c, d) { P.call(this, Rj, { email: c, Ga: !!b }, d, "passwordRecovery"); this.a = a; this.s = b } t(Il, P); Il.prototype.w = function () { this.G(); this.I(this.a, this.s); K(this.i()) || this.i().focus(); Nj(this, this.i(), this.a); Il.o.w.call(this) };
        Il.prototype.l = function () { this.s = this.a = null; Il.o.l.call(this) }; p(Il.prototype, { i: rk, C: sk, G: tk, L: uk, B: vk, T: ik, M: jk, I: kk }); function Jl(a, b) { var c = b.B(); if (c) { var d = Q(b); W(a, Lj(b, n(X(a).sendPasswordResetEmail, X(a)), [c], function () { b.m(); var e = new xk(c, function () { e.m(); V(a, d) }); e.render(d); Z(a, e) }, function (a) { M(b.i(), !1); N(b.C(), U(a)) })) } else b.i().focus() } G.passwordRecovery = function (a, b, c, d, e) { var f = new Il(function () { Jl(a, f) }, d ? void 0 : function () { f.m(); V(a, b) }, c); f.render(b); Z(a, f); e && f.g(e) }; G.passwordSignIn =
            function (a, b, c) { var d = new wk(function () { bl(a, d) }, function () { var c = d.L(); d.m(); H("passwordRecovery", a, b, c) }, c); d.render(b); Z(a, d) }; function Kl() { return L(this, "firebaseui-id-name") } function Ll() { return L(this, "firebaseui-id-name-error") } function Ml(a, b, c, d, e, f, g) { P.call(this, Qj, { email: e, sb: b, name: f, pa: a, Ga: !!d }, g, "passwordSignUp"); this.a = c; this.G = d; this.C = b } t(Ml, P); Ml.prototype.w = function () {
                this.aa(); this.C && this.Fa(); this.wa(); this.va(this.a, this.G); this.C ? (Mj(this, this.i(), this.B()), Mj(this, this.B(),
                    this.s())) : Mj(this, this.i(), this.s()); this.a && Nj(this, this.s(), this.a); K(this.i()) ? this.C && !K(this.B()) ? this.B().focus() : this.s().focus() : this.i().focus(); Ml.o.w.call(this)
            }; Ml.prototype.l = function () { this.G = this.a = null; Ml.o.l.call(this) }; p(Ml.prototype, {
                i: rk, T: sk, aa: tk, Ra: uk, L: vk, B: Kl, Ub: Ll, Fa: function () { var a = Kl.call(this), b = Ll.call(this); bj(this, a, function () { hj(b) && (M(a, !0), gj(b)) }) }, I: function () {
                    var a = Kl.call(this); var b = Ll.call(this); var c = K(a); c = !/^[\s\xa0]*$/.test(null == c ? "" : String(c)); M(a,
                        c); c ? (gj(b), b = !0) : (N(b, A("Saisissez le nom de votre compte").toString()), b = !1); return b ? Ja(K(a)) : null
                }, s: vl, W: yl, ab: wl, wa: zl, M: Al, Qb: ik, cb: jk, va: kk
            }); function Nl(a, b) {
                var c = Lh(S(a)), d = b.L(), e = null; c && (e = b.I()); var f = b.M(); if (d) {
                    if (c) if (e) e = Ka(e); else { b.B().focus(); return } if (f) {
                        var g = firebase.auth.EmailAuthProvider.credential(d, f); W(a, Lj(b, n(a.vb, a), [d, f], function (d) {
                            var f = { user: d.user, credential: g, operationType: d.operationType, additionalUserInfo: d.additionalUserInfo }; return c ? (d = d.user.updateProfile({ displayName: e }).then(function () {
                                return Tk(a,
                                    b, f)
                            }), W(a, d), d) : Tk(a, b, f)
                        }, function (c) { if (!c.name || "cancel" != c.name) { var e = U(c); switch (c.code) { case "auth/email-already-in-use": return Ol(a, b, d, c); case "auth/too-many-requests": e = A("De trop nombreuses demandes de compte proviennent de votre adresse\u00a0IP. Veuillez r\u00e9essayer dans quelques minutes.").toString(); case "auth/operation-not-allowed": case "auth/weak-password": M(b.s(), !1); N(b.W(), e); break; default: lg("setAccountInfo: " + rg(c)), b.g(e) } } }))
                    } else b.s().focus()
                } else b.i().focus()
            } function Ol(a,
                b, c, d) { function e() { var a = U(d); M(b.i(), !1); N(b.T(), a); b.i().focus() } var f = X(a).fetchProvidersForEmail(c).then(function (d) { d.length ? e() : (d = Q(b), b.m(), H("passwordRecovery", a, d, c, !1, Ed().toString())) }, function () { e() }); W(a, f); return f } G.passwordSignUp = function (a, b, c, d, e) { function f() { g.m(); V(a, b) } var g = new Ml(Kh(S(a)), Lh(S(a)), function () { Nl(a, g) }, e ? void 0 : f, c, d); g.render(b); Z(a, g) }; function Pl() { return L(this, "firebaseui-id-phone-confirmation-code") } function Ql() { return L(this, "firebaseui-id-phone-confirmation-code-error") }
        function Rl() { return L(this, "firebaseui-id-resend-countdown") } function Sl(a, b, c, d, e, f, g, k) { P.call(this, hk, { phoneNumber: e, pa: g }, k, "phoneSignInFinish"); this.Fa = f; this.i = new Bi(1E3); this.C = f; this.I = a; this.a = b; this.G = c; this.L = d } t(Sl, P); Sl.prototype.w = function () {
            var a = this; this.M(this.Fa); ee(this.i, "tick", this.B, !1, this); this.i.start(); fj(this, L(this, "firebaseui-id-change-phone-number-link"), function () { a.I() }); fj(this, this.Ma(), function () { a.L() }); this.wa(this.a); this.W(this.a, this.G); this.s().focus();
            Sl.o.w.call(this)
        }; Sl.prototype.l = function () { this.L = this.G = this.a = this.I = null; Ci(this.i); me(this.i, "tick", this.B); this.i = null; Sl.o.l.call(this) }; Sl.prototype.B = function () { --this.C; 0 < this.C ? this.M(this.C) : (Ci(this.i), me(this.i, "tick", this.B), this.va(), this.Ra()) }; p(Sl.prototype, {
            s: Pl, aa: Ql, wa: function (a) { var b = Pl.call(this), c = Ql.call(this); bj(this, b, function () { hj(c) && (M(b, !0), gj(c)) }); a && cj(this, b, function () { a() }) }, T: function () { var a = Ja(K(Pl.call(this)) || ""); return /^\d{6}$/.test(a) ? a : null }, Ya: Rl, M: function (a) {
                kc(Rl.call(this),
                    A("Renvoyer le code dans\u00a0" + ((9 < a ? "0:" : "0:0") + a)).toString())
            }, va: function () { var a = this.Ya(); gj(a) }, Ma: function () { return L(this, "firebaseui-id-resend-link") }, Ra: function () { N(this.Ma()) }, cb: ik, ab: jk, W: kk
        }); function Tl(a, b, c, d) {
            function e(a) { b.s().focus(); M(b.s(), !1); N(b.aa(), a) } var f = b.T(); f ? (b.ua("mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active firebaseui-progress-dialog-loading-icon", A("Validation\u2026").toString()), W(a, Lj(b, n(d.confirm, d), [f], function (c) {
                b.j(); b.ua("firebaseui-icon-done",
                    A("Le code a bien \u00e9t\u00e9 valid\u00e9.").toString()); var d = setTimeout(function () { b.j(); b.m(); var d = { user: Rk(a).currentUser, credential: null, operationType: c.operationType, additionalUserInfo: c.additionalUserInfo }; Tk(a, b, d, !0) }, 1E3); W(a, function () { b && b.j(); clearTimeout(d) })
            }, function (d) {
                if (d.name && "cancel" == d.name) b.j(); else {
                    var f = U(d); switch (d.code) {
                        case "auth/credential-already-in-use": b.j(); break; case "auth/code-expired": d = Q(b); b.j(); b.m(); H("phoneSignInStart", a, d, c, f); break; case "auth/missing-verification-code": case "auth/invalid-verification-code": b.j();
                            e(f); break; default: b.j(), b.g(f)
                    }
                }
            }))) : e(Ad().toString())
        } G.phoneSignInFinish = function (a, b, c, d, e, f) { var g = new Sl(function () { g.m(); H("phoneSignInStart", a, b, c) }, function () { Tl(a, g, c, e) }, function () { g.m(); V(a, b) }, function () { g.m(); H("phoneSignInStart", a, b, c) }, mh(c), d, Kh(S(a))); g.render(b); Z(a, g); f && g.g(f) }; var Ul = !v && !(u("Safari") && !(pb() || u("Coast") || u("Opera") || u("Edge") || u("Silk") || u("Android"))); function Vl(a, b) {
            if (/-[a-z]/.test(b)) return null; if (Ul && a.dataset) {
                if (!(!u("Android") || pb() || u("Firefox") ||
                    u("Opera") || u("Silk") || b in a.dataset)) return null; a = a.dataset[b]; return void 0 === a ? null : a
            } return a.getAttribute("data-" + String(b).replace(/([A-Z])/g, "-$1").toLowerCase())
        } function Wl(a, b, c) { a = Zc(uj, { items: a }, null, this.v); Bj.call(this, a, !0, !0); c && (c = Xl(a, c)) && (c.focus(), Ui(c, a)); fj(this, a, function (a) { if (a = (a = lc(a.target, "firebaseui-id-list-box-dialog-button")) && Vl(a, "listboxid")) Cj(), b(a) }) } function Xl(a, b) {
            a = (a || document).getElementsByTagName("BUTTON"); for (var c = 0; c < a.length; c++)if (Vl(a[c], "listboxid") ===
                b) return a[c]; return null
        } function Yl() { return L(this, "firebaseui-id-phone-number") } function Zl() { return L(this, "firebaseui-id-phone-number-error") } function $l() { return Za(jh, function (a) { return { id: a.c, Ba: "firebaseui-flag " + am(a), label: a.name + " " + ("\u200e+" + a.b) } }) } function am(a) { return "firebaseui-flag-" + a.f } function bm() { var a = this; Wl.call(this, $l(), function (b) { cm.call(a, b, !0); a.F().focus() }, this.oa) } function cm(a, b) {
            var c = ih(a); if (c) {
                if (b) {
                    var d = Ja(K(Yl.call(this)) || ""); b = gh(d); if (b.length && b[0].b !=
                        c.b) { d = "+" + c.b + d.substr(b[0].b.length + 1); b = Yl.call(this); var e = b.type; switch (m(e) && e.toLowerCase()) { case "checkbox": case "radio": b.checked = d; break; case "select-one": b.selectedIndex = -1; if (m(d)) for (var f = 0; e = b.options[f]; f++)if (e.value == d) { e.selected = !0; break } break; case "select-multiple": m(d) && (d = [d]); for (f = 0; e = b.options[f]; f++)if (e.selected = !1, d) for (var g, k = 0; g = d[k]; k++)e.value == g && (e.selected = !0); break; default: b.value = null != d ? d : "" } }
                } b = ih(this.oa); this.oa = a; a = L(this, "firebaseui-id-country-selector-flag");
                b && pi(a, am(b)); oi(a, am(c)); kc(L(this, "firebaseui-id-country-selector-code"), "\u200e+" + c.b)
            }
        } function dm(a, b) { try { var c = "number" == typeof a.selectionStart } catch (d) { c = !1 } c ? (a.selectionStart = b, a.selectionEnd = b) : v && !Eb("9") && ("textarea" == a.type && (b = a.value.substring(0, b).replace(/(\r\n|\r|\n)/g, "\n").length), a = a.createTextRange(), a.collapse(!0), a.move("character", b), a.select()) } function em(a, b, c, d, e, f) { P.call(this, gk, { eb: c, na: e || null }, f, "phoneSignInStart"); this.G = d || null; this.I = c; this.a = a; this.B = b } t(em,
            P); em.prototype.w = function () { this.W(this.G); this.L(this.a, this.B); this.I || Mj(this, this.F(), this.i()); Nj(this, this.i(), this.a); this.F().focus(); dm(this.F(), (this.F().value || "").length); em.o.w.call(this) }; em.prototype.l = function () { this.B = this.a = null; em.o.l.call(this) }; p(em.prototype, {
                F: Yl, C: Zl, W: function (a, b) {
                    var c = this, d = Yl.call(this), e = L(this, "firebaseui-id-country-selector"), f = Zl.call(this); cm.call(this, a || "1-US-0"); fj(this, e, function () { bm.call(c) }); bj(this, d, function () {
                    hj(f) && (M(d, !0), gj(f)); var a =
                        Ja(K(d) || ""), b = ih(this.oa); a = gh(a); a.length && a[0].b != b.b && (b = a[0], cm.call(c, "1" == b.b ? "1-US-0" : b.c))
                    }); b && cj(this, d, function () { b() })
                }, M: function () { var a = Ja(K(Yl.call(this)) || ""), b = gh(a), c = ih(this.oa); b.length && b[0].b != c.b && cm.call(this, b[0].c); b.length && (a = a.substr(b[0].b.length + 1)); return a ? new kh(this.oa, a) : null }, T: function () { return L(this, "firebaseui-recaptcha-container") }, s: function () { return L(this, "firebaseui-id-recaptcha-error") }, i: ik, aa: jk, L: kk
            }); function fm(a, b, c, d) {
                var e = b.M(); e ? Yh ? (b.ua("mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active firebaseui-progress-dialog-loading-icon",
                    A("Validation\u2026").toString()), W(a, Lj(b, n(a.yb, a), [mh(e), c], function (c) { var d = Q(b); b.ua("firebaseui-icon-done", A("Le code a bien \u00e9t\u00e9 envoy\u00e9.").toString()); var f = setTimeout(function () { b.j(); b.m(); H("phoneSignInFinish", a, d, e, 15, c) }, 1E3); W(a, function () { b && b.j(); clearTimeout(f) }) }, function (a) {
                        b.j(); if (!a.name || "cancel" != a.name) {
                            grecaptcha.reset($h); Yh = null; var c = a && a.message || ""; if (a.code) switch (a.code) {
                                case "auth/too-many-requests": c = A("Ce num\u00e9ro de t\u00e9l\u00e9phone a \u00e9t\u00e9 utilis\u00e9 un trop grand nombre de fois").toString();
                                    break; case "auth/invalid-phone-number": case "auth/missing-phone-number": b.F().focus(); N(b.C(), zd().toString()); return; default: c = U(a)
                            }b.g(c)
                        }
                    }))) : Zh ? N(b.s(), A("R\u00e9soudre le reCAPTCHA").toString()) : !Zh && d && b.i().click() : (b.F().focus(), N(b.C(), zd().toString()))
            } G.phoneSignInStart = function (a, b, c, d) {
                var e = Fh(S(a)) || {}; Yh = null; Zh = !(e && "invisible" === e.size); var f = Jh(S(a)), g = dl(a) ? Ih(S(a)) : null, k = new em(function (b) { fm(a, k, q, !(!b || !b.keyCode)) }, function () { q.clear(); k.m(); V(a, b) }, Zh, c && c.a || f && f.c || null,
                    c && c.na || g); k.render(b); Z(a, k); d && k.g(d); e.callback = function (b) { k.s() && gj(k.s()); Yh = b; Zh || fm(a, k, q) }; e["expired-callback"] = function () { Yh = null }; var q = new firebase.auth.RecaptchaVerifier(Zh ? k.T() : k.i(), e, Rk(a).app); W(a, Lj(k, n(q.render, q), [], function (a) { $h = a }, function (c) { c.name && "cancel" == c.name || (c = U(c), k.m(), V(a, b, void 0, c)) }))
            }; function gm(a, b, c) { P.call(this, fk, { rb: b }, c, "providerSignIn"); this.a = a } t(gm, P); gm.prototype.w = function () { this.i(this.a); gm.o.w.call(this) }; gm.prototype.l = function () {
            this.a =
                null; gm.o.l.call(this)
            }; p(gm.prototype, { i: function (a) { function b(b) { a(b) } for (var c = this.h ? dc("firebaseui-id-idp-button", this.h || this.v.a) : [], d = 0; d < c.length; d++) { var e = c[d], f = Vl(e, "providerId"); fj(this, e, Ea(b, f)) } } }); G.providerSignIn = function (a, b, c) { var d = new gm(function (c) { c == firebase.auth.EmailAuthProvider.PROVIDER_ID ? (d.m(), el(a, b)) : c == firebase.auth.PhoneAuthProvider.PROVIDER_ID ? (d.m(), H("phoneSignInStart", a, b)) : Yk(a, d, c); Y(a); a.J.cancel() }, Bh(S(a))); d.render(b); Z(a, d); c && d.g(c); hm(a) }; function im(a,
                b, c, d) { P.call(this, Oj, { email: c, bb: !!b }, d, "signIn"); this.i = a; this.s = b } t(im, P); im.prototype.w = function () { this.C(this.i); this.G(this.i, this.s || void 0); this.a().focus(); dm(this.a(), (this.a().value || "").length); im.o.w.call(this) }; im.prototype.l = function () { this.s = this.i = null; im.o.l.call(this) }; p(im.prototype, { a: rk, L: sk, C: tk, I: uk, B: vk, T: ik, M: jk, G: kk }); G.signIn = function (a, b, c, d) {
                    var e = cl(a) && Dh(S(a)) != oh, f = new im(function () { var b = f, c = b.B() || ""; c && fl(a, b, c) }, e ? null : function () { f.m(); V(a, b, c) }, c); f.render(b);
                    Z(a, f); d && f.g(d)
                }; function jm(a, b) {
                this.U = !1; var c = km(b); if (lm[c]) throw Error('An AuthUI instance already exists for the key "' + c + '"'); lm[c] = this; this.h = a; this.V = null; mm(this.h); this.u = firebase.initializeApp({ apiKey: a.app.options.apiKey, authDomain: a.app.options.authDomain }, a.app.name + "-firebaseui-temp").auth(); mm(this.u); this.u.setPersistence && this.u.setPersistence(firebase.auth.Auth.Persistence.SESSION); this.$ = b; this.B = new nh; this.g = this.H = this.i = this.D = null; this.j = []; this.s = !1; this.J = Gf.Ia(); this.a =
                    this.A = null; this.v = !1
                } function mm(a) { a && a.INTERNAL && a.INTERNAL.logFramework && a.INTERNAL.logFramework("FirebaseUI-web") } var lm = {}; function km(a) { return a || "[DEFAULT]" } function Zk(a) {
                    Y(a); a.i || (a.i = nm(a, function (b) {
                        return b && !Xg(T(a)) ? E(Rk(a).getRedirectResult().then(function (a) { return a }, function (b) { if (b && "auth/email-already-in-use" == b.code && b.email && b.credential) throw b; return om(a, b) })) : E(X(a).getRedirectResult().then(function (b) {
                            return xh(S(a)) && !b.user && a.a && !a.a.isAnonymous ? Rk(a).getRedirectResult() :
                                b
                        }))
                    })); return a.i
                } function Z(a, b) { Y(a); a.g = b } var pm = null; function gl() { return pm } function X(a) { Y(a); return a.u } function Rk(a) { Y(a); return a.h } function T(a) { Y(a); return a.$ } h = jm.prototype; h.nb = function () { Y(this); return "pending" === Qg(Mg, T(this)) }; h.start = function (a, b) {
                    Y(this); var c = this; "undefined" !== typeof this.h.languageCode && (this.V = this.h.languageCode); var d = "fr".replace(/_/g, "-"); this.h.languageCode = d; this.u.languageCode = d; this.Ta(b); F(Mg, T(this)); var e = l.document; this.A ? this.A.then(function () {
                        "complete" ==
                        e.readyState ? qm(c, a) : fe(window, "load", function () { qm(c, a) })
                    }) : "complete" == e.readyState ? qm(c, a) : fe(window, "load", function () { qm(c, a) })
                }; function qm(a, b) {
                    var c = nf(b); c.setAttribute("lang", "fr".replace(/_/g, "-")); if (pm) { var d = pm; Y(d); Xg(T(d)) && Vf && Uf("UI Widget is already rendered on the page and is pending some user interaction. Only one widget instance can be rendered per page. The previous instance has been automatically reset."); pm.reset() } pm = a; a.H = c; rm(a, c); Bg(new Cg) && Bg(new Dg) ? ll(a, b) : (b = nf(b),
                        c = new Dk(A("Le navigateur que vous utilisez n'est pas compatible avec le stockage Web. Veuillez r\u00e9essayer dans un navigateur diff\u00e9rent.").toString()), c.render(b), Z(a, c))
                } function nm(a, b) { if (a.v) return b(sm(a)); W(a, function () { a.v = !1 }); if (xh(S(a))) { var c = new D(function (c) { W(a, a.h.onAuthStateChanged(function (d) { a.a = d; a.v || (a.v = !0, c(b(sm(a)))) })) }); W(a, c); return c } a.v = !0; return b(null) } function sm(a) { Y(a); return xh(S(a)) && a.a && a.a.isAnonymous ? a.a : null } function W(a, b) {
                    Y(a); if (b) {
                        a.j.push(b);
                        var c = function () { fb(a.j, function (a) { return a == b }) }; "function" != typeof b && b.then(c, c)
                    }
                } h.disableAutoSignIn = function () { Y(this); this.s = !0 }; function tm(a) { Y(a); var b; (b = a.s) || (a = S(a), a = Hh(a, firebase.auth.GoogleAuthProvider.PROVIDER_ID), b = !(!a || "select_account" !== a.prompt)); return b } h.reset = function () {
                    Y(this); var a = this; this.H && this.H.removeAttribute("lang"); this.D && ye(this.D); "undefined" !== typeof this.h.languageCode && (this.h.languageCode = this.V); F(Mg, T(this)); Y(this); this.J.cancel(); this.i = E({
                        user: null,
                        credential: null
                    }); pm == this && (pm = null); this.H = null; for (var b = 0; b < this.j.length; b++)if ("function" == typeof this.j[b]) this.j[b](); else this.j[b].cancel && this.j[b].cancel(); this.j = []; F(Lg, T(this)); this.g && (this.g.m(), this.g = null); this.F = null; this.u && (this.A = tl(this).then(function () { a.A = null }, function () { a.A = null }))
                }; function rm(a, b) { a.F = null; a.D = new ze(b); xe(a.D); ee(a.D, "pageEnter", function (b) { b = b && b.pageId; if (a.F != b) { var c = S(a); (c = Oh(c).uiChanged || null) && c(a.F, b); a.F = b } }) } h.Ta = function (a) {
                    Y(this); var b =
                        this.B, c; for (c in a) try { ah(b.a, c, a[c]) } catch (d) { lg('Invalid config: "' + c + '"') } xb && ah(b.a, "popupMode", !1)
                }; function S(a) { Y(a); return a.B } h.tb = function () {
                    Y(this); var a = S(this), b = bh(a.a, "widgetUrl"); var c = vh(a, b); if (S(this).a.get("popupMode")) {
                        a = (window.screen.availHeight - 600) / 2; b = (window.screen.availWidth - 500) / 2; var d = c || "about:blank"; a = { width: 500, height: 600, top: 0 < a ? a : 0, left: 0 < b ? b : 0, location: !0, resizable: !0, statusbar: !0, toolbar: !1 }; a.target = a.target || d.target || "google_popup"; a.width = a.width || 690; a.height =
                            a.height || 500; a || (a = {}); b = window; c = d instanceof Pb ? d : Tb("undefined" != typeof d.href ? d.href : String(d)); d = a.target || d.target; var e = []; for (f in a) switch (f) { case "width": case "height": case "top": case "left": e.push(f + "=" + a[f]); break; case "target": case "noopener": case "noreferrer": break; default: e.push(f + "=" + (a[f] ? 1 : 0)) }var f = e.join(","); (u("iPhone") && !u("iPod") && !u("iPad") || u("iPad") || u("iPod")) && b.navigator && b.navigator.standalone && d && "_self" != d ? (f = b.document.createElement("A"), c instanceof Pb || c instanceof
                                Pb || (c = c.ja ? c.ha() : String(c), Sb.test(c) || (c = "about:invalid#zClosurez"), c = Ub(c)), f.href = Rb(c), f.setAttribute("target", d), a.noreferrer && f.setAttribute("rel", "noreferrer"), a = document.createEvent("MouseEvent"), a.initMouseEvent("click", !0, !0, b, 1), f.dispatchEvent(a), f = {}) : a.noreferrer ? (f = b.open("", d, f), a = Rb(c), f && (vb && -1 != a.indexOf(";") && (a = "'" + a.replace(/'/g, "%27") + "'"), f.opener = null, Kb("b/12014412, meta tag with sanitized URL"), a = '<META HTTP-EQUIV="refresh" content="0; url=' + Ka(a) + '">', a = Yb(a, null), f.document.write(Xb(a)),
                                    f.document.close())) : (f = b.open(Rb(c), d, f)) && a.noopener && (f.opener = null); f && f.focus()
                    } else lf(c)
                }; function Y(a) { if (a.U) throw Error("AuthUI instance is deleted!"); } h.hb = function () { var a = this; Y(this); return this.u.app.delete().then(function () { var b = km(T(a)); delete lm[b]; a.reset(); a.U = !0 }) }; function hm(a) { Y(a); try { If(a.J, Ch(S(a)), tm(a)).then(function (b) { return a.g ? al(a, a.g, b) : !1 }) } catch (b) { } } h.xb = function (a, b) {
                    Y(this); var c = this; return X(this).signInAndRetrieveDataWithEmailAndPassword(a, b).then(function (d) {
                        return nm(c,
                            function (e) { return e ? tl(c).then(function () { return om(c, { code: "auth/email-already-in-use" }, firebase.auth.EmailAuthProvider.credential(a, b)) }) : d })
                    })
                }; h.vb = function (a, b) { Y(this); var c = this; return nm(this, function (d) { if (d) { var e = firebase.auth.EmailAuthProvider.credential(a, b); return d.linkAndRetrieveDataWithCredential(e) } return X(c).createUserAndRetrieveDataWithEmailAndPassword(a, b) }) }; h.wb = function (a) {
                    Y(this); var b = this; return nm(this, function (c) {
                        return c ? c.linkAndRetrieveDataWithCredential(a).then(function (a) { return a },
                            function (c) { if (c && "auth/email-already-in-use" == c.code && c.email && c.credential) throw c; return om(b, c, a) }) : X(b).signInAndRetrieveDataWithCredential(a)
                    })
                }; function $k(a, b) { Y(a); return nm(a, function (c) { return c && !Xg(T(a)) ? c.linkWithPopup(b).then(function (a) { return a }, function (b) { if (b && "auth/email-already-in-use" == b.code && b.email && b.credential) throw b; return om(a, b) }) : X(a).signInWithPopup(b) }) } h.zb = function (a) {
                    Y(this); var b = this, c = this.i; this.i = null; return nm(this, function (c) {
                        return c && !Xg(T(b)) ? c.linkWithRedirect(a) :
                            X(b).signInWithRedirect(a)
                    }).then(function () { }, function (a) { b.i = c; throw a; })
                }; h.yb = function (a, b) { Y(this); var c = this; return nm(this, function (d) { return d ? d.linkWithPhoneNumber(a, b).then(function (a) { return new Kf(a, function (a) { if ("auth/credential-already-in-use" == a.code) return om(c, a); throw a; }) }) : Rk(c).signInWithPhoneNumber(a, b).then(function (a) { return new Kf(a) }) }) }; function Sk(a, b) {
                    Y(a); return nm(a, function (c) {
                        return a.a && !a.a.isAnonymous && xh(S(a)) && !X(a).currentUser ? tl(a).then(function () { return a.a }) :
                            c ? tl(a).then(function () { return c.linkWithCredential(b) }).then(function () { return c }, function (c) { if (c && "auth/email-already-in-use" == c.code && c.email && c.credential) throw c; return om(a, c, b) }) : tl(a).then(function () { return Rk(a).signInWithCredential(b) })
                    })
                } function Vk(a, b) {
                    Y(a); return nm(a, function (c) {
                        if (a.a && !a.a.isAnonymous && xh(S(a)) && !X(a).currentUser) return tl(a).then(function () { "password" == b.credential.providerId && (b.credential = null); return b }); if (c) return tl(a).then(function () { return c.linkAndRetrieveDataWithCredential(b.credential) }).then(function (a) {
                        b.user =
                            a.user; b.credential = a.credential; b.operationType = a.operationType; b.additionalUserInfo = a.additionalUserInfo; return b
                        }, function (c) { if (c && "auth/email-already-in-use" == c.code && c.email && c.credential) throw c; return om(a, c, b.credential) }); if (!b.credential) throw Error("No credential found!"); return tl(a).then(function () { return Rk(a).signInAndRetrieveDataWithCredential(b.credential) }).then(function (a) { b.user = a.user; b.credential = a.credential; b.operationType = a.operationType; return b })
                    })
                } h.ub = function (a, b) {
                    Y(this);
                    return X(this).signInAndRetrieveDataWithEmailAndPassword(a, b)
                }; function tl(a) { Y(a); return X(a).signOut() } function om(a, b, c) { Y(a); if (b && b.code && ("auth/email-already-in-use" == b.code || "auth/credential-already-in-use" == b.code)) { var d = yh(S(a)); return E().then(function () { return d(new Gd("anonymous-upgrade-merge-conflict", null, c || b.credential)) }).then(function () { a.g && (a.g.m(), a.g = null); throw b; }) } return Ze(b) } r("firebaseui.auth.AuthUI", jm); r("firebaseui.auth.AuthUI.getInstance", function (a) {
                    a = km(a); return lm[a] ?
                        lm[a] : null
                }); r("firebaseui.auth.AuthUI.prototype.disableAutoSignIn", jm.prototype.disableAutoSignIn); r("firebaseui.auth.AuthUI.prototype.start", jm.prototype.start); r("firebaseui.auth.AuthUI.prototype.setConfig", jm.prototype.Ta); r("firebaseui.auth.AuthUI.prototype.signIn", jm.prototype.tb); r("firebaseui.auth.AuthUI.prototype.reset", jm.prototype.reset); r("firebaseui.auth.AuthUI.prototype.delete", jm.prototype.hb); r("firebaseui.auth.AuthUI.prototype.isPendingRedirect", jm.prototype.nb); r("firebaseui.auth.AuthUIError",
                    Gd); r("firebaseui.auth.AuthUIError.prototype.toJSON", Gd.prototype.toJSON); r("firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM", oh); r("firebaseui.auth.CredentialHelper.GOOGLE_YOLO", "googleyolo"); r("firebaseui.auth.CredentialHelper.NONE", "none")
    })(); if (typeof window !== 'undefined') { window.dialogPolyfill = require('dialog-polyfill'); }
})(); module.exports = firebaseui;
