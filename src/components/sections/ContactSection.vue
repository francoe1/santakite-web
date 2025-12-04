<template>
  <section id="contacto" class="section">
    <div class="contact-card">
      <div class="section-head">
        <div>
          <h2>Contacto y Coordinación</h2>
          <p>Avisá día y hora para evitar cruces y respetar las zonas del spot.</p>
        </div>
      </div>
      <div class="contact-grid">
        <component
          :is="contact.href ? 'a' : 'div'"
          v-for="contact in contacts"
          :key="contact.label"
          class="contact-item"
          :href="contact.href"
          :target="contact.href ? '_blank' : null"
          :rel="contact.href ? 'noreferrer' : null"
        >
          <span class="icon" v-html="icons[contact.icon] || ''"></span>
          <div>
            <p class="label">{{ contact.label }}</p>
            <p class="value">{{ contact.value }}</p>
            <p v-if="contact.detail" class="detail">{{ contact.detail }}</p>
          </div>
        </component>
      </div>
      <div class="cta-row">
        <a class="primary" href="https://wa.me/543456479677" target="_blank" rel="noreferrer">
          <span v-html="icons.whatsapp"></span>
          WhatsApp
        </a>
        <a class="ghost" href="https://www.instagram.com/santakitechajari/" target="_blank" rel="noreferrer">
          <span v-html="icons.instagram"></span>
          Instagram
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  contacts: {
    type: Array,
    default: () => [],
  },
})

const icons = {
  whatsapp:
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.966-.273-.099-.472-.148-.67.15-.198.297-.767.966-.94 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.173.198-.297.297-.495.099-.198.05-.371-.025-.52-.074-.149-.669-1.611-.916-2.206-.242-.58-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.793.372-.273.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.626.712.227 1.36.195 1.872.118.571-.085 1.758-.718 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.486 2 2 6.262 2 11.5c0 1.854.553 3.584 1.5 5.053L2 22l5.676-1.47C8.718 21.164 10.314 21.5 12 21.5c5.514 0 10-4.262 10-9.5S17.514 2 12 2zm-8 9.5C4 7.91 7.582 4.5 12 4.5s8 3.41 8 7.5-3.582 7.5-8 7.5c-1.514 0-2.919-.383-4.107-1.047l-.293-.158L4.24 19.76l.89-2.942-.18-.298A6.464 6.464 0 0 1 4 11.5z" fill="currentColor"/></svg>',
  instagram:
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4-4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3.5" stroke="currentColor" stroke-width="1.8"/><circle cx="17" cy="7" r="0.9" fill="currentColor"/></svg>',
  location:
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2c3.866 0 7 2.98 7 6.654 0 4.92-5.83 11.068-6.484 11.73a.75.75 0 0 1-1.032 0C10.83 19.722 5 13.574 5 8.654 5 4.98 8.134 2 12 2zm0 3.5a3.154 3.154 0 1 0 0 6.308 3.154 3.154 0 0 0 0-6.308z" fill="currentColor"/></svg>',
}
</script>

<style scoped>
.section {
  margin-top: 4rem;
  padding-top: 3rem;
  border-top: 1px solid var(--slate-200);
}

.contact-card {
  padding: 2rem;
  border-radius: 1.5rem;
  background: white;
  border: 1px solid var(--slate-200);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 900px;
  margin: 0 auto;
}

.section-head {
  text-align: center;
}

h2 {
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  margin-bottom: 0.5rem;
  font-weight: 700;
}

p {
  color: var(--slate-600);
  font-size: 1.1rem;
}

.contact-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.contact-item {
  flex: 1 1 280px;
  padding: 1rem 1.25rem;
  border-radius: 1rem;
  background-color: var(--slate-50);
  border: 1px solid var(--slate-200);
  display: flex;
  gap: 1rem;
  align-items: center;
  color: inherit;
  transition: all 0.2s ease;
}

.contact-item:hover {
  border-color: var(--sky-400);
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.icon {
  display: inline-flex;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: white;
  align-items: center;
  justify-content: center;
  color: var(--sky-500);
  border: 1px solid var(--slate-200);
}

.label {
  color: var(--slate-500);
  font-size: 0.9rem;
}

.value {
  color: var(--slate-800);
  font-weight: 600;
  font-size: 1rem;
}

.detail {
  color: var(--slate-500);
  font-size: 0.85rem;
}

.primary,
.ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  border-radius: 999px;
  padding: 0.85rem 1.6rem;
  font-weight: 600;
  border: 1px solid;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.primary {
  background-color: var(--sky-500);
  color: white;
  border-color: var(--sky-500);
}
.primary:hover {
  background-color: var(--sky-600);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(2, 132, 199, 0.2);
}

.ghost {
  background-color: transparent;
  color: var(--slate-700);
  border-color: var(--slate-300);
}
.ghost:hover {
  background-color: var(--slate-100);
  border-color: var(--slate-400);
  transform: translateY(-2px);
}
.ghost .icon {
  color: var(--pink-500);
}

.cta-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 1rem;
}
</style>
