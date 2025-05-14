/**
 * PrimeVue Component Explorer
 * A professional showcase app for PrimeVue components
 * @author Dariusz Sikorski https://dariuszsikorski.pl
 */

// Initialize development logger
const dev = {
    log: (message, ...args) => console.log(`%c[Explorer] ${message}`, 'color: #4f46e5', ...args),
    warn: (message, ...args) => console.warn(`%c[Explorer] ${message}`, 'color: #f59e0b', ...args),
    error: (message, ...args) => console.error(`%c[Explorer] ${message}`, 'color: #ef4444', ...args),
    info: (message, ...args) => console.info(`%c[Explorer] ${message}`, 'color: #3b82f6', ...args)
};

// Define component categories based on the official PrimeVue menu
const componentCategories = [
    {
        name: 'Form',
        icon: 'pi-check-square',
        components: [
            'AutoComplete', 'CascadeSelect', 'Checkbox', 'ColorPicker', 
            'DatePicker', 'Editor', 'FloatLabel', 'IconField', 'IftaLabel', 
            'InputGroup', 'InputMask', 'InputNumber', 'InputOtp', 'InputText', 
            'KeyFilter', 'Knob', 'Listbox', 'MultiSelect', 'Password', 
            'RadioButton', 'Rating', 'Select', 'SelectButton', 'Slider', 
            'Textarea', 'ToggleButton', 'ToggleSwitch', 'TreeSelect'
        ]
    },
    {
        name: 'Button',
        icon: 'pi-desktop',
        components: ['Button', 'SpeedDial', 'SplitButton']
    },
    {
        name: 'Data',
        icon: 'pi-table',
        components: [
            'DataTable', 'DataView', 'OrderList', 'OrgChart', 'Paginator', 
            'PickList', 'Timeline', 'Tree', 'Treetable', 'VirtualScroller'
        ]
    },
    {
        name: 'Panel',
        icon: 'pi-window-maximize',
        components: [
            'Accordion', 'Card', 'DeferredContent', 'Divider', 'Fieldset', 
            'Panel', 'ScrollPanel', 'Splitter', 'Stepper', 'Tabs', 'Toolbar'
        ]
    },
    {
        name: 'Overlay',
        icon: 'pi-clone',
        components: [
            'ConfirmDialog', 'ConfirmPopup', 'Dialog', 'Drawer', 
            'DynamicDialog', 'Popover', 'Tooltip'
        ]
    },
    {
        name: 'File',
        icon: 'pi-file',
        components: ['FileUpload']
    },
    {
        name: 'Menu',
        icon: 'pi-bars',
        components: [
            'Breadcrumb', 'ContextMenu', 'Dock', 'Menu', 'Menubar', 
            'MegaMenu', 'PanelMenu', 'TieredMenu'
        ]
    },
    {
        name: 'Chart',
        icon: 'pi-chart-bar',
        components: ['Chart']
    },
    {
        name: 'Messages',
        icon: 'pi-comment',
        components: ['Message', 'Toast']
    },
    {
        name: 'Media',
        icon: 'pi-image',
        components: ['Carousel', 'Galleria', 'Image', 'ImageCompare']
    },
    {
        name: 'Misc',
        icon: 'pi-box',
        components: [
            'AnimateOnScroll', 'Avatar', 'Badge', 'BlockUi', 'Chip', 
            'FocusTrap', 'Fluid', 'Inplace', 'MeterGroup', 'ProgressBar', 
            'ProgressSpinner', 'ScrollTop', 'Skeleton', 'Ripple', 
            'StyleClass', 'Tag', 'Terminal'
        ]
    }
];

// Process file list to create a collection of component objects
function processComponentFiles(fileListText) {
    // Collection of component objects
    const components = [];
    // Helper map to track components with multiple images
    const multiImageMap = new Map();
    
    const lines = fileListText.split('\n');
    
    lines.forEach(line => {
        // Extract filename from the line
        const match = line.match(/\d+\s+(\S+)\.png/);
        if (!match) return;
        
        const filename = match[1];
        
        // Extract base component name (handle special cases like FileUpload1, FileUpload2)
        let componentName = filename;
        const numericSuffix = componentName.match(/(\D+)(\d+)$/);
        
        if (numericSuffix) {
            componentName = numericSuffix[1];
            
            // Track this component as having multiple images
            if (!multiImageMap.has(componentName)) {
                multiImageMap.set(componentName, []);
            }
            multiImageMap.get(componentName).push(filename);
            
            // Skip adding this as a separate component now
            // We'll add multi-image components after processing all lines
            return;
        }
        
        // Skip "Forms.png" and "Icons.png" which aren't actual components
        if (componentName === 'Forms' || componentName === 'Icons') {
            return;
        }
        
        // Format title with proper spacing and casing
        let displayName = componentName;
        if (componentName === 'BlockUi') displayName = 'BlockUI';
        else if (componentName === 'OrgChart') displayName = 'Organization Chart';
        
        // Create link path
        let link = componentName.toLowerCase();
        if (componentName === 'OrgChart') link = 'organizationchart';
        
        // Add this component to our collection
        components.push({
            img: `${filename}.png`,
            link,
            title: displayName,
            category: getCategoryForComponent(componentName)
        });
    });
    
    // Now handle components with multiple images
    multiImageMap.forEach((filenames, baseName) => {
        // Skip if this isn't a real component (like Forms or Icons)
        if (baseName === 'Forms' || baseName === 'Icons') {
            return;
        }
        
        // Use the first image for the component
        const primaryFilename = filenames[0];
        
        // Format the display name
        let displayName = baseName;
        if (baseName === 'FileUpload') displayName = 'File Upload';
        else if (baseName === 'Inplace') displayName = 'Inplace';
        
        // Create link path
        const link = baseName.toLowerCase();
        
        // Add this multi-image component
        components.push({
            img: `${primaryFilename}.png`,
            link,
            title: displayName,
            hasMultipleImages: true,
            additionalImages: filenames.slice(1).map(name => `${name}.png`),
            category: getCategoryForComponent(baseName)
        });
    });
    
    dev.log('Processed component collection:', components);
    return components;
}

// Helper to determine the category for a component
function getCategoryForComponent(componentName) {
    for (const category of componentCategories) {
        if (category.components.includes(componentName)) {
            return category.name;
        }
    }
    return 'Other';
}

// Create a component card element with professional styling
function createComponentCard(component) {
    const card = document.createElement('div');
    card.className = 'Component';
    card.dataset.name = component.title.toLowerCase();
    card.dataset.category = component.category.toLowerCase();
    
    // Add animation delay for staggered appearance
    const delay = Math.random() * 0.3;
    card.style.animationDelay = `${delay}s`;
    
    // Mark multi-image components
    if (component.hasMultipleImages) {
        card.classList.add('is-multi');
    }
    
    const link = document.createElement('a');
    link.className = 'Component_link';
    link.href = `https://primevue.org/${component.link}/`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    const imageContainer = document.createElement('div');
    imageContainer.className = 'Component_imageContainer';
    
    const img = document.createElement('img');
    img.className = 'Component_image';
    img.src = `./screens/${component.img}`;
    img.alt = `${component.title} component screenshot`;
    img.loading = 'lazy';
    
    const info = document.createElement('div');
    info.className = 'Component_info';
    
    const title = document.createElement('div');
    title.className = 'Component_title';
    title.textContent = component.title;
    
    const categoryText = document.createElement('div');
    categoryText.className = 'Component_category';
    
    const icon = document.createElement('i');
    icon.className = `pi ${getCategoryIcon(component.category)}`;
    
    categoryText.appendChild(icon);
    categoryText.appendChild(document.createTextNode(component.category));
    
    imageContainer.appendChild(img);
    info.appendChild(title);
    info.appendChild(categoryText);
    
    link.appendChild(imageContainer);
    link.appendChild(info);
    card.appendChild(link);
    
    return card;
}

// Get icon for a category
function getCategoryIcon(categoryName) {
    const category = componentCategories.find(c => c.name === categoryName);
    return category ? category.icon : 'pi-tag';
}

// Render component sections by category with professional styling
function renderComponentsByCategory(components) {
    const container = document.getElementById('componentsContainer');
    container.innerHTML = '';
    
    // Group components by category
    const categorizedComponents = {};
    
    components.forEach(component => {
        if (!categorizedComponents[component.category]) {
            categorizedComponents[component.category] = [];
        }
        categorizedComponents[component.category].push(component);
    });
    
    // Create sidebar navigation
    createCategoryNavigation(categorizedComponents);
    
    // Create sections for each category that has components
    componentCategories.forEach(category => {
        const categoryComponents = categorizedComponents[category.name] || [];
        
        // Skip empty categories
        if (categoryComponents.length === 0) return;
        
        const section = document.createElement('section');
        section.className = 'App_category';
        section.id = `category-${category.name.toLowerCase()}`;
        section.dataset.category = category.name.toLowerCase();
        
        const header = document.createElement('div');
        header.className = 'App_categoryHeader';
        
        const heading = document.createElement('h2');
        heading.className = 'App_categoryTitle';
        heading.textContent = category.name;
        
        const count = document.createElement('span');
        count.className = 'App_categoryCount';
        count.textContent = categoryComponents.length;
        
        const componentsGrid = document.createElement('div');
        componentsGrid.className = 'App_categoryGrid';
        
        // Create and add component cards for this category
        categoryComponents.forEach(component => {
            const card = createComponentCard(component);
            componentsGrid.appendChild(card);
        });
        
        header.appendChild(heading);
        header.appendChild(count);
        section.appendChild(header);
        section.appendChild(componentsGrid);
        container.appendChild(section);
    });
    
    // Update component statistics
    updateComponentStats(components);
    
    dev.log('Rendered component sections');
}

// Create sidebar navigation for categories
function createCategoryNavigation(categorizedComponents) {
    const categoryNav = document.getElementById('categoryNav');
    categoryNav.innerHTML = '';
    
    componentCategories.forEach(category => {
        const components = categorizedComponents[category.name] || [];
        if (components.length === 0) return;
        
        const li = document.createElement('li');
        li.className = 'App_navItem';
        li.dataset.category = category.name.toLowerCase();
        
        li.addEventListener('click', () => {
            // Scroll to category
            const categoryElement = document.getElementById(`category-${category.name.toLowerCase()}`);
            if (categoryElement) {
                window.scrollTo({
                    top: categoryElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
            
            // Set active state
            document.querySelectorAll('.App_navItem').forEach(item => {
                item.classList.remove('is-active');
            });
            li.classList.add('is-active');
        });
        
        const navText = document.createElement('div');
        navText.className = 'App_navText';
        
        const icon = document.createElement('i');
        icon.className = `pi ${category.icon}`;
        
        const span = document.createElement('span');
        span.textContent = category.name;
        
        const badge = document.createElement('div');
        badge.className = 'App_navBadge';
        badge.textContent = components.length;
        
        navText.appendChild(icon);
        navText.appendChild(span);
        navText.appendChild(badge);
        li.appendChild(navText);
        categoryNav.appendChild(li);
    });
}

// Update component statistics
function updateComponentStats(components) {
    const componentCount = document.getElementById('componentCount');
    const categoryCount = document.getElementById('categoryCount');
    
    if (componentCount && categoryCount) {
        componentCount.textContent = components.length;
        
        // Count unique categories
        const uniqueCategories = new Set();
        components.forEach(component => uniqueCategories.add(component.category));
        categoryCount.textContent = uniqueCategories.size;
    }
}

// Search functionality with professional implementation
function setupSearch(components) {
    const searchInput = document.getElementById('searchInput');
    const clearButton = document.getElementById('clearSearch');
    const resetButton = document.getElementById('resetSearch');
    const noResultsElement = document.getElementById('noResults');
    
    // Show/hide clear button
    function toggleClearButton() {
        clearButton.style.display = searchInput.value ? 'flex' : 'none';
    }
    
    // Filter components based on search term
    function filterComponents(searchTerm) {
        const normalizedSearchTerm = searchTerm.toLowerCase();
        const componentElements = document.querySelectorAll('.Component');
        let visibleCount = 0;
        
        componentElements.forEach(component => {
            const componentName = component.dataset.name;
            const categoryName = component.dataset.category;
            
            // Search in component name or category
            const isVisible = componentName.includes(normalizedSearchTerm) || 
                              categoryName.includes(normalizedSearchTerm);
            
            component.classList.toggle('is-hidden', !isVisible);
            if (isVisible) visibleCount++;
        });
        
        // Show/hide categories based on whether they have visible components
        document.querySelectorAll('.App_category').forEach(category => {
            const hasVisibleComponents = category.querySelector('.Component:not(.is-hidden)');
            category.classList.toggle('is-hidden', !hasVisibleComponents);
        });
        
        // Show "no results" message if needed
        noResultsElement.classList.toggle('is-visible', visibleCount === 0);
        
        // Update navigation active state
        updateNavigationState();
        
        dev.info(`Search for "${searchTerm}" found ${visibleCount} results`);
    }
    
    // Clear search
    function clearSearch() {
        searchInput.value = '';
        toggleClearButton();
        filterComponents('');
        searchInput.focus();
    }
    
    // Event listeners
    searchInput.addEventListener('input', () => {
        toggleClearButton();
        filterComponents(searchInput.value);
    });
    
    clearButton.addEventListener('click', clearSearch);
    resetButton.addEventListener('click', clearSearch);
    
    // Initialize clear button state
    toggleClearButton();
    
    dev.log('Search functionality initialized');
}

// Update navigation active state based on scroll position
function setupScrollSpy() {
    const navItems = document.querySelectorAll('.App_navItem');
    const categories = document.querySelectorAll('.App_category');
    const scrollToTopButton = document.getElementById('scrollToTop');
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopButton.classList.add('is-visible');
        } else {
            scrollToTopButton.classList.remove('is-visible');
        }
        
        // Update navigation active state on scroll
        updateNavigationState();
    });
    
    // Scroll to top button click
    scrollToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Initialize active state
    setTimeout(updateNavigationState, 100);
    
    dev.log('Scroll spy initialized');
}

// Update navigation active state
function updateNavigationState() {
    const navItems = document.querySelectorAll('.App_navItem');
    const categories = document.querySelectorAll('.App_category:not(.is-hidden)');
    
    if (categories.length === 0) return;
    
    // Find the category that is currently in view
    let activeCategory = null;
    const scrollPosition = window.scrollY + 100;
    
    categories.forEach(category => {
        if (category.offsetTop <= scrollPosition) {
            activeCategory = category.dataset.category;
        }
    });
    
    // If no category is in view, use the first one
    if (!activeCategory && categories.length > 0) {
        activeCategory = categories[0].dataset.category;
    }
    
    // Update active state
    navItems.forEach(item => {
        if (item.dataset.category === activeCategory) {
            item.classList.add('is-active');
        } else {
            item.classList.remove('is-active');
        }
    });
}

// Main initialization function
function initExplorer() {
    dev.log('Initializing PrimeVue Component Explorer');
    
    // This would typically be an AJAX request to get the file list
    // For this example, we're using the hardcoded file list from paste-2.txt
    const fileListText = `14.05.2025  10:31            16 042 Accordion.png
14.05.2025  10:31            21 613 AnimateOnScroll.png
14.05.2025  10:31            11 042 AutoComplete.png
14.05.2025  10:31            12 778 Avatar.png
14.05.2025  10:31             1 537 Badge.png
14.05.2025  10:31            14 294 BlockUi.png
14.05.2025  10:31             3 716 Breadcrumb.png
14.05.2025  10:31             5 876 Button.png
14.05.2025  10:31            39 614 Card.png
14.05.2025  10:31            51 463 Carousel.png
14.05.2025  10:31             8 412 CascadeSelect.png
14.05.2025  10:31            21 963 Chart.png
14.05.2025  10:31               567 Checkbox.png
14.05.2025  10:31             7 791 Chip.png
14.05.2025  10:31            14 532 ColorPicker.png
14.05.2025  10:31             5 331 ConfirmDialog.png
14.05.2025  10:31             5 782 ConfirmPopup.png
14.05.2025  10:31           146 137 ContextMenu.png
14.05.2025  10:31            55 058 DataTable.png
14.05.2025  10:31            68 746 DataView.png
14.05.2025  10:31             8 360 DatePicker.png
14.05.2025  10:31           111 208 DeferredContent.png
14.05.2025  10:31             8 584 Dialog.png
14.05.2025  10:31            44 304 Divider.png
14.05.2025  10:31            35 472 Dock.png
14.05.2025  10:31             8 802 Drawer.png
14.05.2025  10:31            26 212 DynamicDialog.png
14.05.2025  10:31             3 252 Editor.png
14.05.2025  10:31            17 004 Fieldset.png
14.05.2025  10:31             6 089 FileUpload1.png
14.05.2025  10:31             4 370 FileUpload2.png
14.05.2025  10:31             1 244 FloatLabel.png
14.05.2025  10:31             4 551 Fluid.png
14.05.2025  10:31             4 033 FocusTrap.png
14.05.2025  10:31             4 654 Forms.png
14.05.2025  10:31           239 483 Galleria.png
14.05.2025  10:31             1 481 IconField.png
14.05.2025  12:33             1 362 Icons.png
14.05.2025  10:31               985 IftaLabel.png
14.05.2025  10:31            22 133 Image.png
14.05.2025  10:31           293 568 ImageCompare.png
14.05.2025  10:31             1 301 Inplace1.png
14.05.2025  10:31            14 590 Inplace2.png
14.05.2025  10:31             4 526 InputGroup.png
14.05.2025  10:31               760 InputMask.png
14.05.2025  10:31             2 233 InputNumber.png
14.05.2025  10:31             1 013 InputOtp.png
14.05.2025  10:31               688 InputText.png
14.05.2025  10:31             2 579 KeyFilter.png
14.05.2025  10:31             1 508 Knob.png
14.05.2025  10:31             5 427 Listbox.png
14.05.2025  10:31            16 695 MegaMenu.png
14.05.2025  10:31             9 841 Menu.png
14.05.2025  10:31             7 524 Menubar.png
14.05.2025  10:31             8 024 Message.png
14.05.2025  10:31             9 332 MeterGroup.png
14.05.2025  10:30             7 099 MultiSelect.png
14.05.2025  10:30            15 196 OrderList.png
14.05.2025  10:30            12 297 OrgChart.png
14.05.2025  10:30             3 421 Paginator.png
14.05.2025  10:30            19 474 Panel.png
14.05.2025  10:30             3 355 PanelMenu.png
14.05.2025  10:30             3 885 Password.png
14.05.2025  10:30            24 896 PickList.png
14.05.2025  10:30            13 510 Popover.png
14.05.2025  10:30               503 ProgressBar.png
14.05.2025  10:30             1 213 ProgressSpinner.png
14.05.2025  10:30             2 888 RadioButton.png
14.05.2025  10:30               812 Rating.png
14.05.2025  10:30             2 618 Ripple.png
14.05.2025  10:30            36 797 ScrollPanel.png
14.05.2025  10:30            11 211 ScrollTop.png
14.05.2025  10:30             9 625 Select.png
14.05.2025  10:30             2 089 SelectButton.png
14.05.2025  10:30             1 236 Skeleton.png
14.05.2025  10:30               502 Slider.png
14.05.2025  10:30             2 174 SpeedDial.png
14.05.2025  10:30             5 740 SplitButton.png
14.05.2025  10:30             2 884 Splitter.png
14.05.2025  10:30             5 251 Stepper.png
14.05.2025  10:30             1 482 StyleClass.png
14.05.2025  10:30            17 018 Tabs.png
14.05.2025  10:30             4 164 Tag.png
14.05.2025  10:30             2 904 Terminal.png
14.05.2025  10:30             1 066 Textarea.png
14.05.2025  10:30             4 405 TieredMenu.png
14.05.2025  10:30             8 571 Timeline.png
14.05.2025  10:30            15 538 Toast.png
14.05.2025  10:30             1 802 ToggleButton.png
14.05.2025  10:30               644 ToggleSwitch.png
14.05.2025  10:30             2 866 Toolbar.png
14.05.2025  10:30             2 803 Tooltip.png
14.05.2025  10:30             6 855 Tree.png
14.05.2025  10:30             5 050 TreeSelect.png
14.05.2025  10:30            10 740 Treetable.png
14.05.2025  10:30             2 800 VirtualScroller.png`;
    
    // Process the file list to get our component collection
    const components = processComponentFiles(fileListText);
    
    // Output the collection to console so it can be used directly if needed
    dev.log('Component collection:', JSON.stringify(components, null, 2));
    
    // Render the components organized by category
    renderComponentsByCategory(components);
    
    // Set up search functionality
    setupSearch(components);
    
    // Set up scroll spy for navigation
    setupScrollSpy();
    
    // Handle mobile navigation toggle
    setupMobileNavigation();

    // Setup UI Scale Controls
    setupScaleControls();
}

// Setup mobile navigation toggle
function setupMobileNavigation() {
    // Create mobile menu toggle button
    const headerContent = document.querySelector('.App_headerContent');
    const sidebar = document.querySelector('.App_sidebar');
    
    if (headerContent && sidebar) {
        const menuToggle = document.createElement('button');
        menuToggle.className = 'App_menuToggle';
        menuToggle.innerHTML = '<i class="pi pi-bars"></i>';
        
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('is-open');
            
            // Toggle button icon
            const icon = menuToggle.querySelector('i');
            if (sidebar.classList.contains('is-open')) {
                icon.className = 'pi pi-times';
            } else {
                icon.className = 'pi pi-bars';
            }
        });
        
        headerContent.insertBefore(menuToggle, headerContent.firstChild);
        
        // Close sidebar when clicking outside
        document.addEventListener('click', (event) => {
            if (!sidebar.contains(event.target) && !menuToggle.contains(event.target) && sidebar.classList.contains('is-open')) {
                sidebar.classList.remove('is-open');
                menuToggle.querySelector('i').className = 'pi pi-bars';
            }
        });
        
        // Close sidebar when a nav item is clicked
        document.querySelectorAll('.App_navItem').forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth < 1025) {
                    sidebar.classList.remove('is-open');
                    menuToggle.querySelector('i').className = 'pi pi-bars';
                }
            });
        });
        
        // Add mobile menu toggle styles
        const style = document.createElement('style');
        style.textContent = `
            .App_menuToggle {
                display: none;
                align-items: center;
                justify-content: center;
                width: 2.5rem;
                height: 2.5rem;
                border-radius: 50%;
                border: none;
                background-color: var(--gray-100);
                color: var(--gray-700);
                font-size: 1rem;
                cursor: pointer;
                transition: var(--transition);
                margin-right: 1rem;
            }
            
            .App_menuToggle:hover {
                background-color: var(--primary-light);
                color: var(--primary-color);
            }
            
            @media (max-width: 1024px) {
                .App_menuToggle {
                    display: flex;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    dev.log('Mobile navigation initialized');
}

// Setup UI Scale Controls
function setupScaleControls() {
    const scaleButton = document.getElementById('scaleControl');
    if (!scaleButton) {
        dev.warn('Scale control button not found.');
        return;
    }

    const scales = [
        { level: 1, text: '100%', icon: 'pi-zoom-in' }, 
        { level: 1.25, text: '125%', icon: 'pi-zoom-in' }, 
        { level: 1.5, text: '150%', icon: 'pi-zoom-in' } // Static icon
    ];
    let currentScaleIndex = 0;

    // Function to apply scale and update button
    function applyScale(index) {
        currentScaleIndex = index % scales.length;
        const scale = scales[currentScaleIndex];
        
        document.body.style.zoom = scale.level;
        // Update button content to include icon and text
        scaleButton.innerHTML = `<i class="pi ${scale.icon}" style="margin-right: 0.25rem;"></i> ${scale.text}`;
        scaleButton.title = `Change UI Scale (Currently ${scale.text})`;
        
        // Persist to localStorage
        localStorage.setItem('uiScaleLevel', scale.level.toString());
        localStorage.setItem('uiScaleIndex', currentScaleIndex.toString());
        dev.log(`UI Scale set to ${scale.text} (${scale.level})`);
    }

    // Load persisted scale on init
    const persistedScaleLevel = localStorage.getItem('uiScaleLevel');
    const persistedScaleIndex = localStorage.getItem('uiScaleIndex');

    if (persistedScaleLevel) {
        const initialIndex = parseInt(persistedScaleIndex, 10) || 0;
        // Ensure the loaded index is valid for the current scales array
        if (initialIndex >= 0 && initialIndex < scales.length && scales[initialIndex].level.toString() === persistedScaleLevel) {
            applyScale(initialIndex);
        } else {
            // If persisted data is inconsistent, default to 100%
            applyScale(0);
        }
    } else {
        // Default to 100% if no persisted scale
        applyScale(0);
    }

    scaleButton.addEventListener('click', () => {
        applyScale(currentScaleIndex + 1);
    });

    dev.log('UI Scale controls initialized');
}

// Initialize the explorer when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initExplorer);
