document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');
    const experienceItems = document.querySelectorAll('.experience-item');
    const projectItems = document.querySelectorAll('.project-item');
    const skillTags = document.querySelectorAll('.skill-tag');
    const proficiencyFills = document.querySelectorAll('.proficiency-fill');
    const linkItems = document.querySelectorAll('.link-item');

    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(12px)';
        section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

        setTimeout(() => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, index * 70);
    });

    experienceItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-8px)';
        item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 250 + index * 90);
    });

    projectItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(10px)';
        item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 350 + index * 70);
    });

    skillTags.forEach((tag, index) => {
        tag.style.opacity = '0';
        tag.style.transform = 'scale(0.85)';
        tag.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

        setTimeout(() => {
            tag.style.opacity = '1';
            tag.style.transform = 'scale(1)';
        }, 500 + index * 25);
    });

    proficiencyFills.forEach((fill, index) => {
        const width = fill.style.width;
        fill.style.width = '0%';
        fill.style.transition = 'width 1s cubic-bezier(0.4, 0, 0.2, 1)';

        setTimeout(() => {
            fill.style.width = width;
        }, 600 + index * 150);
    });

    linkItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-5px)';
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 800 + index * 80);
    });
});