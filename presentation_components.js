// ==========================================================================
// COMPONENTES DE RENDERIZADO: PRESENTACIÓN INVESTIGACIÓN PP3 - GRUPO C (V2)
// Tema Oscuro Agradable, 100% en Español, sin inglés ni japonés.
// Mantiene todo el texto técnico y la estructura original de "Presentacion".
// ==========================================================================

window.APP_COMPONENTS = {

  renderSlideContent: function(slide, index) {
    if (!slide) return '<div class="card-box">Diapositiva no encontrada</div>';

    switch (slide.type) {
      case 'cover':
        return this.renderCover(slide);
      case 'llm_topic':
        return this.renderLLMTopicSlide(slide);
      case 'agents_harness_topic':
        return this.renderAgentsSlide(slide);
      case 'testing_topic':
        return this.renderTestingQAReliability(slide);
      case 'matrix_safety_topic':
        return this.renderMatrixSafetySlide(slide);
      case 'pros_overview':
        return this.renderProsSlide(slide);
      case 'cons_overview':
        return this.renderConsSlide(slide);
      case 'cognitive_impact':
        return this.renderCognitiveImpactSlide(slide);
      case 'role_evolution':
        return this.renderRoleEvolutionSlide(slide);
      case 'professional_workflow':
        return this.renderProfessionalWorkflowSlide(slide);
      case 'side_by_side_comparison':
        return this.renderCodeDemoSlide(slide);
      case 'synthesis_conclusions':
        return this.renderConclusionSlide(slide);
      default:
        return `<div class="card-box"><h3>${slide.slideTitle}</h3><p>${slide.slideSubtitle}</p></div>`;
    }
  },

  // --------------------------------------------------------------------------
  // 1. PORTADA: LOS 4 INTEGRANTES Y SUS TEMAS
  // --------------------------------------------------------------------------
  renderCover: function(slide) {
    const researchers = (slide.content && slide.content.researchers) || [];
    const colors = ['#6366f1', '#f43f5e', '#f59e0b', '#10b981'];

    return `
      <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; height:100%; padding:1rem 0; gap:2.5rem;">
        <div style="text-align:center;">
          <div style="font-size:0.85rem; font-family:var(--font-mono); color:var(--accent-cyan); text-transform:uppercase; letter-spacing:0.12em; margin-bottom:0.75rem;">
            PRÁCTICAS PROFESIONALIZANTES III · GRUPO C
          </div>
          <h1 style="font-size:3rem; font-weight:800; line-height:1.2; margin-bottom:0.6rem; color:#f8fafc; font-family:var(--font-sans);">
            Programación Asistida por Inteligencia Artificial
          </h1>
          <div style="font-size:1.1rem; color:#94a3b8; font-weight:400;">
            Investigación Técnica Comparativa y Criterios Profesionales de Ingeniería
          </div>
        </div>

        <!-- 4 Tarjetas de los Investigadores centradas -->
        <div class="grid-4" style="width:100%; max-width:1300px; gap:1.25rem;">
          ${researchers.map((r, i) => {
            const color = colors[i % colors.length];
            return `
            <div class="card-box" style="padding:1.6rem 1.4rem; border-top:4px solid ${color}; background:rgba(15,23,42,0.9); display:flex; flex-direction:column; justify-content:space-between; min-height:165px; box-shadow:0 12px 30px rgba(0,0,0,0.4); border-radius:12px;">
              <div style="font-size:1.22rem; font-weight:700; color:#f8fafc; margin-bottom:0.85rem;">${r.name}</div>
              <div style="font-size:0.88rem; color:#cbd5e1; line-height:1.6; border-top:1px solid rgba(255,255,255,0.08); padding-top:0.75rem;">
                ${r.topics}
              </div>
            </div>
          `;
          }).join('')}
        </div>
      </div>
    `;
  },

  // --------------------------------------------------------------------------
  // 2. TEMA 1: LLM AISLADOS
  // --------------------------------------------------------------------------
  renderLLMTopicSlide: function(slide) {
    const c = slide.content;

    return `
      <div style="display:flex; flex-direction:column; gap:1.25rem; height:100%;">
        <div class="card-box" style="border-left:4px solid #6366f1; padding:1.1rem 1.4rem; background:rgba(15,23,42,0.9);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
            <span class="tag tag-indigo">Interacción Aislada con Modelos de Lenguaje</span>
            <span style="font-size:0.82rem; color:#94a3b8; font-family:var(--font-mono);">${c.tools}</span>
          </div>
          <p style="font-size:0.94rem; color:#e2e8f0; line-height:1.55;">${c.intro}</p>
        </div>

        <div class="grid-2" style="flex:1; gap:1.25rem;">
          <div class="card-box" style="display:flex; flex-direction:column; justify-content:space-between; border-color:rgba(16,185,129,0.3); background:rgba(15,23,42,0.9);">
            <div>
              <h3 style="font-size:1.15rem; font-weight:700; color:#34d399; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
                <span>✓</span> Ventajas del Modelo Aislado
              </h3>
              <ul class="clean-list" style="display:flex; flex-direction:column; gap:0.85rem;">
                ${c.pros.map(p => `
                  <li style="display:flex; gap:0.6rem; font-size:0.9rem; color:#cbd5e1; line-height:1.5;">
                    <span style="color:#34d399; font-weight:bold;">•</span>
                    <span>${p}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
            <div style="padding:0.75rem 1rem; background:rgba(16,185,129,0.1); border-radius:8px; font-size:0.82rem; color:#34d399; margin-top:1rem; border:1px solid rgba(16,185,129,0.25);">
              💡 <strong>Ideal para:</strong> Consultas teóricas rápidas, aprender qué hace un comando y resolver dudas puntuales.
            </div>
          </div>

          <div class="card-box" style="display:flex; flex-direction:column; justify-content:space-between; border-color:rgba(244,63,94,0.3); background:rgba(15,23,42,0.9);">
            <div>
              <h3 style="font-size:1.15rem; font-weight:700; color:#fb7185; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
                <span>✗</span> Limitaciones del Modelo Aislado
              </h3>
              <ul class="clean-list" style="display:flex; flex-direction:column; gap:0.85rem;">
                ${c.limits.map(l => `
                  <li style="display:flex; gap:0.6rem; font-size:0.9rem; color:#cbd5e1; line-height:1.5;">
                    <span style="color:#fb7185; font-weight:bold;">•</span>
                    <span>${l}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
            <div style="padding:0.75rem 1rem; background:rgba(244,63,94,0.1); border-radius:8px; font-size:0.82rem; color:#fb7185; margin-top:1rem; border:1px solid rgba(244,63,94,0.25);">
              ⚠️ <strong>Gran Riesgo:</strong> El modelo puede inventar librerías o funciones inexistentes con total seguridad gramatical.
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // --------------------------------------------------------------------------
  // 3. TEMA 2: AGENTES Y ARNÉS (ESQUEMA SVG COMPLETO CON COMPILADOR)
  // --------------------------------------------------------------------------
  renderAgentsSlide: function(slide) {
    const c = slide.content;

    return `
      <div style="display:flex; flex-direction:column; gap:1rem; height:100%;">
        <div class="grid-2" style="gap:1rem;">
          <div class="card-box" style="border-left:4px solid #38bdf8; padding:0.85rem 1.3rem; background:rgba(15,23,42,0.9);">
            <div style="font-size:0.88rem; color:#e2e8f0; line-height:1.5;">
              🤖 <strong>¿Qué es un Agente de Programación?</strong><br>
              ${c.agentDef}
            </div>
          </div>

          <div class="card-box" style="border-left:4px solid #6366f1; padding:0.85rem 1.3rem; background:rgba(15,23,42,0.9);">
            <div style="font-size:0.88rem; color:#e2e8f0; line-height:1.5;">
              🪢 <strong>${c.whyHarness}</strong>
            </div>
          </div>
        </div>

        <div class="grid-4" style="gap:0.75rem;">
          ${c.components.map(comp => `
            <div class="card-box" style="padding:0.75rem 1rem; display:flex; flex-direction:column; justify-content:flex-start; background:rgba(15,23,42,0.9);">
              <h4 style="font-size:0.92rem; font-weight:700; color:#38bdf8; margin-bottom:0.25rem;">${comp.name}</h4>
              <p style="font-size:0.81rem; color:#cbd5e1; line-height:1.4;">${comp.desc}</p>
            </div>
          `).join('')}
        </div>

        <div class="card-box" style="flex:1; padding:0.85rem 1.2rem; background:rgba(10,14,24,0.95); border:1px solid rgba(99,102,241,0.35); display:flex; flex-direction:column; justify-content:center; align-items:center;">
          <div style="font-size:0.8rem; font-weight:700; color:#38bdf8; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:0.5rem; text-align:center;">
            Esquema Visual: La Estructura del Arnés de Control
          </div>
          <svg viewBox="0 0 940 195" style="width:100%; max-height:205px;" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <marker id="v2-dark-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#38bdf8" />
              </marker>
              <marker id="v2-dark-green" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#10b981" />
              </marker>
            </defs>

            <!-- Muro exterior del Arnés de Seguridad -->
            <rect x="10" y="8" width="920" height="178" rx="14" fill="rgba(30, 41, 59, 0.45)" stroke="#6366f1" stroke-width="2" stroke-dasharray="6,4" />
            <text x="25" y="28" fill="#818cf8" font-size="11.5" font-family="monospace" font-weight="bold">ARNÉS DE CONTROL Y SEGURIDAD TÉCNICO</text>

            <!-- 1. Desarrollador / Reglas Fijas -->
            <rect x="25" y="48" width="175" height="122" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="1.6" />
            <text x="112" y="76" text-anchor="middle" fill="#f8fafc" font-size="12" font-weight="bold">👨‍💻 Programador</text>
            <text x="112" y="98" text-anchor="middle" fill="#94a3b8" font-size="10">Reglas estrictas fijadas</text>
            <text x="112" y="116" text-anchor="middle" fill="#94a3b8" font-size="10">Control del contexto</text>
            <text x="112" y="140" text-anchor="middle" fill="#38bdf8" font-size="10" font-weight="bold">Decisión humana final</text>

            <!-- Flecha al Modelo -->
            <path d="M 200 109 L 260 109" stroke="#38bdf8" stroke-width="2.5" marker-end="url(#v2-dark-arrow)" />

            <!-- 2. Núcleo de la IA -->
            <rect x="260" y="42" width="195" height="134" rx="10" fill="rgba(49, 46, 129, 0.85)" stroke="#a855f7" stroke-width="2" />
            <circle cx="357" cy="74" r="17" fill="#a855f7" opacity="0.3" />
            <text x="357" y="80" text-anchor="middle" fill="#c084fc" font-size="17">🧠</text>
            <text x="357" y="107" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="bold">NÚCLEO DE INTELIGENCIA ARTIFICIAL</text>
            <text x="357" y="126" text-anchor="middle" fill="#a5b4fc" font-size="9.5">Cálculo de probabilidades</text>
            <text x="357" y="144" text-anchor="middle" fill="#c4b5fd" font-size="9">Aislado dentro del arnés</text>

            <!-- Flecha a las Herramientas -->
            <path d="M 455 109 L 515 109" stroke="#10b981" stroke-width="2.5" marker-end="url(#v2-dark-green)" />

            <!-- 3. Herramientas y Verificadores (Compilador) -->
            <rect x="515" y="44" width="205" height="58" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="1.6" />
            <text x="617" y="68" text-anchor="middle" fill="#34d399" font-size="11" font-weight="bold">⚡ Terminal y Archivos</text>
            <text x="617" y="86" text-anchor="middle" fill="#94a3b8" font-size="9.5">Acceso y edición controlada</text>

            <rect x="515" y="112" width="205" height="58" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="1.6" />
            <text x="617" y="136" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="bold">🛡️ Verificadores Automáticos</text>
            <text x="617" y="154" text-anchor="middle" fill="#94a3b8" font-size="9.5">Compilador (filtra errores)</text>

            <!-- 4. Caja de Pruebas -->
            <rect x="740" y="42" width="175" height="134" rx="10" fill="rgba(15, 23, 42, 0.95)" stroke="#f43f5e" stroke-width="1.8" />
            <text x="827" y="72" text-anchor="middle" fill="#fb7185" font-size="11" font-weight="bold">🔒 Caja de pruebas</text>
            <text x="827" y="95" text-anchor="middle" fill="#cbd5e1" font-size="9.5">Entorno cerrado</text>
            <text x="827" y="115" text-anchor="middle" fill="#94a3b8" font-size="9.5">Bloquea acciones peligrosas</text>
            <text x="827" y="142" text-anchor="middle" fill="#34d399" font-size="9.5" font-weight="bold">✓ No toca el sistema real</text>
          </svg>
        </div>
      </div>
    `;
  },

  // --------------------------------------------------------------------------
  // 4. TEMA 3: PRUEBAS AUTOMÁTICAS Y CALIDAD (ESTUDIO META)
  // --------------------------------------------------------------------------
  renderTestingQAReliability: function(slide) {
    const c = slide.content;

    return `
      <div style="display:flex; flex-direction:column; gap:1.25rem; height:100%;">
        <div class="card-box" style="border-left:4px solid #f43f5e; padding:0.95rem 1.4rem; background:rgba(15,23,42,0.9);">
          <div style="font-size:0.95rem; font-weight:600; color:#f8fafc; line-height:1.5;">
            ${c.thesis}
          </div>
        </div>

        <div class="card-box" style="border-color:rgba(99,102,241,0.35); background:rgba(15,23,42,0.9); flex:1; display:flex; flex-direction:column; justify-content:space-between; padding:1.25rem 1.5rem;">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
              <span class="tag tag-indigo">Evaluación Práctica en Meta</span>
            </div>
            <h3 style="font-size:1.25rem; font-weight:700; color:#ffffff; margin-bottom:0.4rem;">${c.metaStudy.title}</h3>
            
            <p style="font-size:0.88rem; color:#94a3b8; line-height:1.45; margin-bottom:1.1rem;">
              ${c.metaStudy.context}
            </p>

            <div class="grid-3" style="margin-bottom:1.25rem; gap:1rem;">
              ${c.metaStudy.stats.map(st => `
                <div class="stat-box" style="background:#0f172a; border:1px solid ${st.status === 'warn' ? 'rgba(245,158,11,0.4)' : (st.status === 'ok' ? 'rgba(16,185,129,0.4)' : 'rgba(56,189,248,0.4)')}; border-radius:10px; padding:1rem;">
                  <div class="stat-number" style="font-size:2.2rem; font-weight:800; color:${st.status === 'warn' ? '#f59e0b' : (st.status === 'ok' ? '#10b981' : '#38bdf8')}">
                    ${st.val}
                  </div>
                  <div class="stat-label" style="font-size:0.8rem; color:#cbd5e1; line-height:1.4;">${st.desc}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <div style="padding:0.75rem 1rem; background:rgba(0,0,0,0.35); border-radius:8px; font-size:0.84rem; color:#cbd5e1; line-height:1.45; border:1px solid rgba(255,255,255,0.08);">
            🎯 <strong>Resultado:</strong> ${c.metaStudy.result}
          </div>
        </div>

        <div class="card-box" style="border-left:4px solid #38bdf8; padding:0.9rem 1.4rem; background:rgba(15,23,42,0.9);">
          <h4 style="font-size:0.92rem; font-weight:700; color:#f8fafc; margin-bottom:0.25rem;">${c.selfHealing.title}</h4>
          <p style="font-size:0.83rem; color:#cbd5e1; line-height:1.45;">${c.selfHealing.desc}</p>
        </div>
      </div>
    `;
  },

  // --------------------------------------------------------------------------
  // 5. TEMA 4: SEGURIDAD Y MATRIZ DE DECISIONES
  // --------------------------------------------------------------------------
  renderMatrixSafetySlide: function(slide) {
    const c = slide.content;

    return `
      <div style="display:flex; flex-direction:column; height:100%; gap:0.9rem;">
        <div class="card-box" style="border-left:4px solid #38bdf8; padding:0.85rem 1.4rem; background:rgba(15,23,42,0.9);">
          <div style="font-size:0.88rem; color:#e2e8f0; line-height:1.5;">
            ${c.ruleLead}
          </div>
        </div>

        <div style="flex:1; overflow-y:auto; border:1px solid rgba(255,255,255,0.1); border-radius:10px; background:rgba(15,23,42,0.7);">
          <table style="width:100%; border-collapse:collapse; font-size:0.82rem; text-align:left;">
            <thead>
              <tr style="background:#1e293b; border-bottom:1px solid rgba(255,255,255,0.12); position:sticky; top:0; z-index:2;">
                <th style="padding:10px 14px; color:#38bdf8; font-weight:700;">Tarea del Proyecto</th>
                <th style="padding:10px 14px; color:#38bdf8; font-weight:700; width:170px;">Nivel de Control</th>
                <th style="padding:10px 14px; color:#38bdf8; font-weight:700;">Motivo Técnico</th>
              </tr>
            </thead>
            <tbody id="matrix-tbody">
              ${c.matrix.map(row => `
                <tr class="matrix-row-item" data-level="${row.level}" style="border-bottom:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.04)'" onmouseout="this.style.background='transparent'">
                  <td style="padding:10px 14px; font-weight:700; color:#f1f5f9;">${row.task}</td>
                  <td style="padding:10px 14px;">
                    <span class="badge-${row.level}">
                      ${row.label}
                    </span>
                  </td>
                  <td style="padding:10px 14px; color:#cbd5e1; line-height:1.45;">${row.reason}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // --------------------------------------------------------------------------
  // 6. TEMA 5: VENTAJAS OPERACIONALES (MICROSOFT & MIT)
  // --------------------------------------------------------------------------
  renderProsSlide: function(slide) {
    const c = slide.content;

    return `
      <div style="display:flex; flex-direction:column; gap:1.25rem; height:100%;">
        <div style="font-size:0.92rem; color:#cbd5e1; line-height:1.5;">
          ${c.lead}
        </div>

        <div class="grid-2" style="flex:1; gap:1.25rem;">
          <div class="card-box" style="display:flex; flex-direction:column; justify-content:space-between; border-color:rgba(16,185,129,0.4); background:rgba(15,23,42,0.9); padding:1.25rem;">
            <div>
              <div style="display:flex; justify-content:flex-end; align-items:center; margin-bottom:0.75rem;">
                <span style="font-size:0.78rem; color:#34d399; font-family:var(--font-mono); font-weight:600;">${c.keyStudy.author}</span>
              </div>
              
              <div style="display:flex; align-items:baseline; gap:0.75rem; margin-bottom:0.5rem;">
                <span style="font-size:3.2rem; font-weight:800; color:#34d399; line-height:1;">${c.keyStudy.metric}</span>
                <span style="font-size:1.05rem; font-weight:700; color:#f1f5f9;">${c.keyStudy.metricLabel}</span>
              </div>

              <p style="font-size:0.86rem; color:#cbd5e1; line-height:1.5; margin-top:0.75rem;">
                ${c.keyStudy.desc}
              </p>
            </div>

            <div style="padding:0.75rem 1rem; background:rgba(16,185,129,0.1); border-radius:8px; font-size:0.82rem; color:#34d399; border:1px solid rgba(16,185,129,0.3);">
              ⚡ <strong>Conclusión del caso:</strong> En tareas donde la solución ya se conoce y solo hay que tipear código estándar, la máquina reduce el tiempo a más de la mitad.
            </div>
          </div>

          <div style="display:flex; flex-direction:column; gap:0.65rem;">
            ${c.prosList.map(item => `
              <div class="card-box" style="padding:0.75rem 1rem; border-left:3px solid #34d399; background:rgba(15,23,42,0.9);">
                <h4 style="font-size:0.9rem; font-weight:700; color:#f1f5f9; margin-bottom:0.2rem;">${item.title}</h4>
                <p style="font-size:0.8rem; color:#cbd5e1; line-height:1.4;">${item.desc}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  // --------------------------------------------------------------------------
  // 7. TEMA 6: DESVENTAJAS TÉCNICAS Y DEUDA TÉCNICA
  // --------------------------------------------------------------------------
  renderConsSlide: function(slide) {
    const c = slide.content;

    return `
      <div style="display:flex; flex-direction:column; gap:1rem; height:100%;">
        <div class="card-box" style="border-left:4px solid #f43f5e; padding:0.8rem 1.4rem; background:rgba(15,23,42,0.9);">
          <p style="font-size:0.92rem; color:#ffffff; line-height:1.5; font-weight:600;">
            ${c.paradoxLead}
          </p>
        </div>

        <div class="grid-4" style="flex:1; gap:0.9rem;">
          ${c.stats.map(s => `
            <div class="card-box" style="display:flex; flex-direction:column; justify-content:space-between; border-color:rgba(244,63,94,0.3); background:rgba(15,23,42,0.9); padding:1rem;">
              <div>
                <div style="font-size:2.2rem; font-weight:800; color:#fb7185; line-height:1.1; margin-bottom:0.25rem;">
                  ${s.number}
                </div>
                <div style="font-size:0.88rem; font-weight:700; color:#f1f5f9; margin-bottom:0.5rem;">
                  ${s.label}
                </div>
                <p style="font-size:0.78rem; color:#cbd5e1; line-height:1.45;">
                  ${s.detail}
                </p>
              </div>

              <div style="font-size:0.72rem; color:#94a3b8; font-family:var(--font-mono); border-top:1px solid rgba(255,255,255,0.08); padding-top:0.4rem; margin-top:0.6rem;">
                ${s.source}
              </div>
            </div>
          `).join('')}
        </div>

        <div class="card-box" style="border-left:4px solid #f59e0b; background:rgba(245,158,11,0.1); padding:0.75rem 1.4rem;">
          <p style="font-size:0.84rem; color:#fde68a; line-height:1.45;">
            ⚠️ <strong>${c.risksSummary}</strong>
          </p>
        </div>
      </div>
    `;
  },

  // --------------------------------------------------------------------------
  // 8. TEMA 7: APRENDIZAJE Y FORMACIÓN (MULETA VS TUTOR)
  // --------------------------------------------------------------------------
  renderCognitiveImpactSlide: function(slide) {
    const c = slide.content;

    return `
      <div style="display:flex; flex-direction:column; gap:1.25rem; height:100%;">
        <div style="font-size:0.92rem; color:#cbd5e1; line-height:1.5;">
          ${c.dilemma}
        </div>

        <div class="grid-2" style="flex:1; gap:1.25rem;">
          <div class="card-box" style="display:flex; flex-direction:column; justify-content:space-between; border-color:rgba(244,63,94,0.35); background:rgba(15,23,42,0.9); padding:1.25rem;">
            <div>
              <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.75rem;">
                <span class="tag tag-red">Riesgo Educativo</span>
              </div>
              <h3 style="font-size:1.2rem; font-weight:700; color:#fb7185; margin-bottom:0.75rem;">${c.twoPaths[0].type}</h3>
              
              <div style="margin-bottom:1rem;">
                <strong style="font-size:0.86rem; color:#f8fafc;">Qué hace el alumno:</strong>
                <p style="font-size:0.84rem; color:#cbd5e1; line-height:1.45; margin-top:0.25rem;">${c.twoPaths[0].behavior}</p>
              </div>

              <div>
                <strong style="font-size:0.86rem; color:#f8fafc;">Consecuencia real:</strong>
                <p style="font-size:0.84rem; color:#cbd5e1; line-height:1.45; margin-top:0.25rem;">${c.twoPaths[0].impact}</p>
              </div>
            </div>

            <div style="padding:0.75rem 1rem; background:rgba(244,63,94,0.1); border:1px solid rgba(244,63,94,0.3); border-radius:8px; font-size:0.82rem; color:#fb7185; margin-top:1rem;">
              🚫 <strong>Resultado:</strong> Ilusión de saber. El alumno cree que programa porque la máquina produce código, pero su mente no retiene nada.
            </div>
          </div>

          <div class="card-box" style="display:flex; flex-direction:column; justify-content:space-between; border-color:rgba(16,185,129,0.35); background:rgba(15,23,42,0.9); padding:1.25rem;">
            <div>
              <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.75rem;">
                <span class="tag tag-green">Uso Inteligente</span>
              </div>
              <h3 style="font-size:1.2rem; font-weight:700; color:#34d399; margin-bottom:0.75rem;">${c.twoPaths[1].type}</h3>
              
              <div style="margin-bottom:1rem;">
                <strong style="font-size:0.86rem; color:#f8fafc;">Qué hace el alumno:</strong>
                <p style="font-size:0.84rem; color:#cbd5e1; line-height:1.45; margin-top:0.25rem;">${c.twoPaths[1].behavior}</p>
              </div>

              <div>
                <strong style="font-size:0.86rem; color:#f8fafc;">Consecuencia real:</strong>
                <p style="font-size:0.84rem; color:#cbd5e1; line-height:1.45; margin-top:0.25rem;">${c.twoPaths[1].impact}</p>
              </div>
            </div>

            <div style="padding:0.75rem 1rem; background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.3); border-radius:8px; font-size:0.82rem; color:#34d399; margin-top:1rem;">
              🌱 <strong>Resultado:</strong> Aprendizaje acelerado. Desarrolla criterio propio y capacidad analítica manteniendo el control.
            </div>
          </div>
        </div>

        <div class="card-box" style="border-left:4px solid #f59e0b; padding:0.75rem 1.4rem; background:rgba(15,23,42,0.9);">
          <p style="font-size:0.85rem; color:#fde68a; line-height:1.45;">
            💡 <strong>${c.warning}</strong>
          </p>
        </div>
      </div>
    `;
  },

  // --------------------------------------------------------------------------
  // 9. TEMA 8: EL FUTURO DEL ROL PROFESIONAL
  // --------------------------------------------------------------------------
  renderRoleEvolutionSlide: function(slide) {
    const c = slide.content;

    return `
      <div style="display:flex; flex-direction:column; gap:1.25rem; height:100%;">
        <p style="font-size:0.92rem; color:#cbd5e1; line-height:1.5;">
          ${c.lead}
        </p>

        <div class="grid-2" style="flex:1; gap:1.25rem;">
          <div class="card-box" style="display:flex; flex-direction:column; justify-content:space-between; background:rgba(15,23,42,0.9); padding:1.25rem;">
            <div>
              <span class="tag tag-indigo" style="margin-bottom:0.6rem;">${c.evolution[0].era}</span>
              <h3 style="font-size:1.2rem; font-weight:700; color:#f8fafc; margin-bottom:0.75rem;">${c.evolution[0].role}</h3>
              
              <div style="margin-bottom:1rem; font-size:0.85rem; color:#cbd5e1; line-height:1.5;">
                <strong style="color:#ffffff;">En qué trabajaba:</strong><br>
                ${c.evolution[0].focus}
              </div>
            </div>

            <div style="padding:0.75rem 1rem; background:rgba(0,0,0,0.35); border-radius:8px; font-size:0.8rem; color:#94a3b8; border:1px solid rgba(255,255,255,0.08);">
              <strong style="color:#cbd5e1;">Cómo se evaluaba:</strong> ${c.evolution[0].value}
            </div>
          </div>

          <div class="card-box" style="display:flex; flex-direction:column; justify-content:space-between; border-color:rgba(16,185,129,0.35); background:rgba(15,23,42,0.9); padding:1.25rem;">
            <div>
              <span class="tag tag-green" style="margin-bottom:0.6rem;">${c.evolution[1].era}</span>
              <h3 style="font-size:1.2rem; font-weight:700; color:#34d399; margin-bottom:0.75rem;">${c.evolution[1].role}</h3>
              
              <div style="margin-bottom:1rem; font-size:0.85rem; color:#cbd5e1; line-height:1.5;">
                <strong style="color:#ffffff;">En qué trabaja hoy:</strong><br>
                ${c.evolution[1].focus}
              </div>
            </div>

            <div style="padding:0.75rem 1rem; background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.3); border-radius:8px; font-size:0.8rem; color:#34d399;">
              <strong style="color:#f8fafc;">Cómo se evalúa hoy:</strong> ${c.evolution[1].value}
            </div>
          </div>
        </div>

        <div class="card-box" style="border-left:4px solid #38bdf8; background:rgba(56,189,248,0.08); padding:0.85rem 1.4rem;">
          <p style="font-size:0.85rem; color:#bae6fd; line-height:1.5; font-style:italic;">
            "${c.quote}"
          </p>
        </div>
      </div>
    `;
  },

  // --------------------------------------------------------------------------
  // 10. METODOLOGÍA PROFESIONAL DE ASISTENCIA CON IA
  // --------------------------------------------------------------------------
  renderProfessionalWorkflowSlide: function(slide) {
    const c = slide.content;

    return `
      <div style="display:flex; flex-direction:column; gap:1.25rem; height:100%;">
        <div style="font-size:0.92rem; color:#cbd5e1; line-height:1.5;">
          ${c.lead}
        </div>

        <div style="display:flex; flex-direction:column; gap:0.65rem; flex:1;">
          ${c.workflowSteps.map((st, i) => `
            <div class="card-box" style="display:flex; align-items:center; gap:1.25rem; padding:0.85rem 1.4rem; border-left:4px solid #10b981; background:rgba(15,23,42,0.9);">
              <div style="font-size:1.4rem; font-weight:800; font-family:var(--font-mono); color:#34d399; min-width:45px;">
                0${i+1}
              </div>
              <div style="flex:1;">
                <h4 style="font-size:0.95rem; font-weight:700; color:#f8fafc; margin-bottom:0.2rem;">${st.step}</h4>
                <p style="font-size:0.82rem; color:#cbd5e1; line-height:1.45;">${st.desc}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  // --------------------------------------------------------------------------
  // 11. DEMOSTRACIÓN: VIBECODING VS ASISTIDA EN PYTHON
  // --------------------------------------------------------------------------
  renderCodeDemoSlide: function(slide) {
    const c = slide.content;

    return `
      <div style="display:flex; flex-direction:column; height:100%; gap:0.75rem;">
        <div class="card-box" style="border-left:4px solid #38bdf8; padding:0.65rem 1.2rem; background:rgba(56,189,248,0.08);">
          <p style="font-size:0.82rem; color:#cbd5e1; line-height:1.45;">
            💡 <strong>${c.briefDistinction}</strong>
          </p>
        </div>

        <div class="grid-2" style="flex:1; gap:1rem;">
          <!-- ESTILO VIBECODING EN PYTHON -->
          <div class="card-box" style="display:flex; flex-direction:column; justify-content:space-between; border-color:rgba(244,63,94,0.4); padding:0.85rem; background:rgba(15,23,42,0.9);">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
                <span class="tag tag-red">${c.vibe.title}</span>
                <span style="font-size:0.72rem; color:#fb7185; font-family:var(--font-mono);">Python (Flask / SQLite)</span>
              </div>
              <div style="font-size:0.75rem; color:#cbd5e1; font-style:italic; margin-bottom:0.5rem; background:rgba(0,0,0,0.35); padding:0.35rem 0.6rem; border-radius:4px;">
                ${c.vibe.prompt}
              </div>

              <pre class="code-editor" style="margin:0; font-size:0.73rem; line-height:1.36; max-height:210px; overflow-y:auto; background:#0b0f19; color:#f8fafc; padding:0.75rem; border-radius:6px;"><span style="color:#94a3b8;"># Script desordenado: sin validar, sin hash ni transacciones</span>
<span style="color:#f43f5e;">from</span> flask <span style="color:#f43f5e;">import</span> Flask, request, jsonify
<span style="color:#f43f5e;">import</span> sqlite3

app = <span style="color:#38bdf8;">Flask</span>(__name__)

<span style="color:#38bdf8;">@app.route</span>(<span style="color:#a5b4fc;">'/login-y-cobro'</span>, methods=[<span style="color:#a5b4fc;">'POST'</span>])
<span style="color:#f43f5e;">def</span> <span style="color:#38bdf8;">login_y_cobro</span>():
    data = request.json
    usuario = data[<span style="color:#a5b4fc;">'usuario'</span>]
    clave = data[<span style="color:#a5b4fc;">'clave'</span>]
    monto = <span style="color:#38bdf8;">float</span>(data[<span style="color:#a5b4fc;">'monto'</span>])
    cupon = data.<span style="color:#38bdf8;">get</span>(<span style="color:#a5b4fc;">'cupon'</span>)

    <span style="color:#fb7185;"># ❌ PELIGRO: Consulta vulnerable a inyección SQL directa con f-string</span>
    q = <span style="color:#a5b4fc;">f"SELECT * FROM usuarios WHERE user='{usuario}' AND clave='{clave}'"</span>
    conn = sqlite3.<span style="color:#38bdf8;">connect</span>(<span style="color:#a5b4fc;">'sistema.db'</span>)
    user = conn.<span style="color:#38bdf8;">cursor</span>().<span style="color:#38bdf8;">execute</span>(q).<span style="color:#38bdf8;">fetchone</span>()

    <span style="color:#fb7185;"># ❌ PELIGRO: Contraseña guardada en texto plano sin encriptar</span>
    <span style="color:#f43f5e;">if not</span> user:
        <span style="color:#f43f5e;">return</span> <span style="color:#38bdf8;">jsonify</span>({<span style="color:#a5b4fc;">'error'</span>: <span style="color:#a5b4fc;">'Usuario inválido'</span>}), <span style="color:#fbbf24;">401</span>

    <span style="color:#fb7185;"># ❌ ERROR: Usa función inventada por la IA que no existe</span>
    descuento = <span style="color:#38bdf8;">super_descuento_magico</span>(cupon)
    total = monto - descuento

    <span style="color:#fb7185;"># ❌ FALLA GRAVE: Modifica saldo sin transacción segura ni bloqueo</span>
    conn.<span style="color:#38bdf8;">execute</span>(<span style="color:#a5b4fc;">f"UPDATE cuentas SET saldo = saldo - {total} WHERE user='{usuario}'"</span>)
    conn.<span style="color:#38bdf8;">commit</span>()
    <span style="color:#f43f5e;">return</span> <span style="color:#38bdf8;">jsonify</span>({<span style="color:#a5b4fc;">'ok'</span>: <span style="color:#f43f5e;">True</span>})</pre>
            </div>

            <div style="margin-top:0.5rem; font-size:0.75rem; color:#fb7185; background:rgba(244,63,94,0.1); padding:0.5rem; border-radius:4px; border:1px solid rgba(244,63,94,0.25);">
              <strong>Fallas:</strong> Inyección SQL directa con f-strings · Clave en texto plano · Función inventada · Sin transacción atómica
            </div>
          </div>

          <!-- ESTILO PROGRAMACIÓN ASISTIDA EN PYTHON -->
          <div class="card-box" style="display:flex; flex-direction:column; justify-content:space-between; border-color:rgba(16,185,129,0.4); padding:0.85rem; background:rgba(15,23,42,0.9);">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
                <span class="tag tag-green">${c.pro.title}</span>
                <span style="font-size:0.72rem; color:#34d399; font-family:var(--font-mono);">Python (Pydantic / Argon2 / SQLAlchemy)</span>
              </div>
              <div style="font-size:0.75rem; color:#cbd5e1; font-style:italic; margin-bottom:0.5rem; background:rgba(0,0,0,0.35); padding:0.35rem 0.6rem; border-radius:4px;">
                ${c.pro.prompt}
              </div>

              <pre class="code-editor" style="margin:0; font-size:0.73rem; line-height:1.36; max-height:210px; overflow-y:auto; background:#0b0f19; color:#f8fafc; padding:0.75rem; border-radius:6px;"><span style="color:#94a3b8;"># Capas ordenadas: validación estricta, hash seguro y transacción</span>
<span style="color:#f43f5e;">from</span> pydantic <span style="color:#f43f5e;">import</span> BaseModel, Field
<span style="color:#f43f5e;">from</span> argon2 <span style="color:#f43f5e;">import</span> PasswordHasher
<span style="color:#f43f5e;">from</span> sqlalchemy.orm <span style="color:#f43f5e;">import</span> Session
<span style="color:#f43f5e;">from</span> decimal <span style="color:#f43f5e;">import</span> Decimal
<span style="color:#f43f5e;">from</span> uuid <span style="color:#f43f5e;">import</span> UUID

ph = <span style="color:#38bdf8;">PasswordHasher</span>()

<span style="color:#94a3b8;"># 1. Reglas estrictas: valida tipos y límites antes de procesar</span>
<span style="color:#f43f5e;">class</span> <span style="color:#38bdf8;">CobroRequest</span>(BaseModel):
    usuario_id: UUID
    clave: <span style="color:#38bdf8;">str</span> = <span style="color:#38bdf8;">Field</span>(min_length=<span style="color:#fbbf24;">8</span>)
    monto: Decimal = <span style="color:#38bdf8;">Field</span>(gt=<span style="color:#fbbf24;">0</span>)

<span style="color:#f43f5e;">def</span> <span style="color:#38bdf8;">procesar_cobro_seguro</span>(db: Session, datos: CobroRequest) -&gt; <span style="color:#38bdf8;">bool</span>:
    <span style="color:#34d399;"># 2. Consulta protegida con parámetros contra inyecciones SQL</span>
    usuario = db.<span style="color:#38bdf8;">query</span>(Usuario).<span style="color:#38bdf8;">filter_by</span>(id=datos.usuario_id).<span style="color:#38bdf8;">first</span>()
    <span style="color:#f43f5e;">if not</span> usuario:
        <span style="color:#f43f5e;">raise</span> <span style="color:#38bdf8;">ValueError</span>(<span style="color:#a5b4fc;">"Usuario inexistente"</span>)

    <span style="color:#34d399;"># 3. Verificación criptográfica segura de la contraseña</span>
    <span style="color:#f43f5e;">try</span>:
        ph.<span style="color:#38bdf8;">verify</span>(usuario.hash_clave, datos.clave)
    <span style="color:#f43f5e;">except</span> <span style="color:#38bdf8;">Exception</span>:
        <span style="color:#f43f5e;">raise</span> <span style="color:#38bdf8;">PermissionError</span>(<span style="color:#a5b4fc;">"Credenciales inválidas"</span>)

    <span style="color:#34d399;"># 4. Transacción atómica de base de datos con bloqueo de saldo</span>
    <span style="color:#f43f5e;">with</span> db.<span style="color:#38bdf8;">begin</span>():
        cuenta = db.<span style="color:#38bdf8;">query</span>(Cuenta).<span style="color:#38bdf8;">with_for_update</span>().<span style="color:#38bdf8;">get</span>(datos.usuario_id)
        <span style="color:#f43f5e;">if</span> cuenta.saldo &lt; datos.monto:
            <span style="color:#f43f5e;">raise</span> <span style="color:#38bdf8;">ValueError</span>(<span style="color:#a5b4fc;">"Saldo insuficiente"</span>)
        cuenta.saldo -= datos.monto

    <span style="color:#f43f5e;">return True</span></pre>
            </div>

            <div style="margin-top:0.5rem; font-size:0.75rem; color:#34d399; background:rgba(16,185,129,0.1); padding:0.5rem; border-radius:4px; border:1px solid rgba(16,185,129,0.3);">
              <strong>Garantías:</strong> Validación con Pydantic · Contraseña con Argon2 · Consulta parametrizada · Transacción atómica con reversión segura
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // --------------------------------------------------------------------------
  // 12. CONCLUSIONES FINALES
  // --------------------------------------------------------------------------
  renderConclusionSlide: function(slide) {
    const c = slide.content;

    return `
      <div style="display:flex; flex-direction:column; gap:1.25rem; height:100%;">
        <div class="grid-4" style="flex:1; gap:1rem;">
          ${c.summaryPillars.map(p => `
            <div class="card-box" style="display:flex; flex-direction:column; justify-content:space-between; border-color:rgba(99,102,241,0.3); padding:1.2rem; background:rgba(15,23,42,0.9);">
              <div>
                <h3 style="font-size:1.05rem; font-weight:700; color:#38bdf8; margin-bottom:0.75rem; line-height:1.3;">
                  ${p.topic}
                </h3>
                <p style="font-size:0.85rem; color:#cbd5e1; line-height:1.55;">
                  ${p.takeaway}
                </p>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="card-box highlight" style="border-left:4px solid #10b981; background:linear-gradient(135deg, rgba(16,185,129,0.15), rgba(15,23,42,0.95)); padding:1.25rem 1.6rem; border-color:rgba(16,185,129,0.35);">
          <h3 style="font-size:1.05rem; font-weight:800; color:#34d399; margin-bottom:0.4rem; line-height:1.5;">
            ${c.finalStatement}
          </h3>
        </div>
      </div>
    `;
  }
};
