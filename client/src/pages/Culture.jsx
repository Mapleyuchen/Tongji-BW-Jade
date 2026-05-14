const virtues = [
  {
    char: '仁',
    title: '玉之仁',
    quote: '「温润以泽，仁也」',
    desc: '玉石温润的光泽如同君子的仁德之心，温和而包容。待人接物当如玉石之光，柔和而不刺眼，让人感到温暖舒适。仁者爱人，如玉之泽润，无声而化。'
  },
  {
    char: '义',
    title: '玉之义',
    quote: '「垂之如坠，义也」',
    desc: '玉石沉稳厚重，不随外力而轻易晃动，象征着正直与道义。义者守正，如玉之沉稳，不偏不倚，方能坚守道义，立身处世。'
  },
  {
    char: '礼',
    title: '玉之礼',
    quote: '「缜密以栗，礼也」',
    desc: '玉石质地缜密，结构有序，代表着礼仪与秩序。礼者有序，如玉之缜密，每一道纹理都有其规律，人际交往亦当有节有度。'
  },
  {
    char: '智',
    title: '玉之智',
    quote: '「声远而清，智也」',
    desc: '玉石敲击后，声音清脆悠扬，传播甚远，寓意智慧与通达。智者明辨，如玉之清声，穿透迷雾，洞察本质，指引方向。'
  },
  {
    char: '信',
    title: '玉之信',
    quote: '「瑕不掩瑜，信也」',
    desc: '玉石虽有瑕疵，却不掩其美，表里如一，象征真诚与信用。信者诚实，如玉之无伪，内外一致，言行相符，方能立信于人。'
  }
];

const history = [
  {
    era: '新石器时代',
    period: '约7000年前',
    desc: '玉器文化萌芽。红山文化、良渚文化中出现大量玉器，成为权力与地位的象征，反映了先民对玉石的崇拜与神化。'
  },
  {
    era: '商周时期',
    period: '约3000年前',
    desc: '礼玉制度形成。玉器成为重要礼器，"六器礼天地四方"，玉璧、玉琮等成为祭祀核心，确立了玉的神圣地位。'
  },
  {
    era: '秦汉时期',
    period: '约2000年前',
    desc: '葬玉文化盛行。玉衣、玉塞等葬具大量出现，"金缕玉衣"成为皇族专属，体现了玉有不朽护体之信仰。'
  },
  {
    era: '唐宋时期',
    period: '约1000年前',
    desc: '玉器走向世俗化。从纯粹的礼器、葬器向日用器物发展，出现了大量精美的陈设玉、装饰玉，文人雅趣与玉相融。'
  },
  {
    era: '明清时期',
    period: '约300年前',
    desc: '玉雕艺术鼎盛。宫廷用玉与民间用玉并行发展，题材丰富，工艺精湛。新疆和田玉成为主流，翡翠从缅甸传入并风靡全国。'
  }
];

const classics = [
  {
    title: '《礼记》',
    quote: '君子比德于玉焉，温润而泽，仁也；缜密以栗，知也；廉而不刿，义也；垂之如坠，礼也；叩之其声清越以长，智也；不桡而折，勇也；瑕适并见，情也；扣之其声清越以长，其终诎然，乐也；斐然有文，地也；尝鬻于市，贾不及人，廉也；坚刚而不可变，守也。',
    source: '《礼记·聘义》'
  },
  {
    title: '《说文解字》',
    quote: '玉，石之美，有五德。润泽以温，仁之方也；鰓理自外，可以知中，义之方也；其声舒扬，专以远闻，智之方也；不桡而折，勇之方也；锐廉而不忮，洁之方也。',
    source: '许慎《说文解字》'
  },
  {
    title: '《诗经》',
    quote: '言念君子，温其如玉。在其板屋，乱我心曲。',
    source: '《诗经·秦风·小戎》'
  },
  {
    title: '《本草纲目》',
    quote: '玉性平无毒。久服轻身长年，治疮疡热毒，镇惊悸，安魂魄，止渴，除烦热，明耳目，悦皮肤，助声喉。',
    source: '李时珍《本草纲目》'
  },
  {
    title: '《荀子》',
    quote: '故君子必佩玉，右徵角，左宫羽，趋以《采齐》，行以《肆夏》，周还中规，折还中矩，进则揖之，退则扬之，然后玉锵鸣也。',
    source: '《荀子·大略》'
  }
];

const poetry = [
  { title: '白玉赋', lines: '白玉如霜月，光华自天来。\n温泽入手冷，持之忘尘埃。', author: '清·乾隆御制' },
  { title: '咏玉', lines: '何年采玉深山里，\n流水声中一片心。\n千古灵奇留不去，\n化作温润润君衿。', author: '宋·苏东坡' },
  { title: '玉诗', lines: '兰陵美酒郁金香，\n玉碗盛来琥珀光。\n但使主人能醉客，\n不知何处是他乡。', author: '唐·李白' },
  { title: '和田玉颂', lines: '昆仑雪顶育奇珍，\n千年地脉蕴精魂。\n温柔一握情无限，\n君子无故玉不离身。', author: '现代' },
  { title: '翡翠吟', lines: '一抹翠绿惊春色，\n琢磨光华照古今。\n缅甸山深玉出处，\n匠心独运世间稀。', author: '现代' },
  { title: '玉之颂', lines: '玉出昆山质自洁，\n磨而不磷志弥坚。\n温润无声藏大雅，\n君子佩之德无边。', author: '现代' }
];

export default function Culture() {
  return (
    <div className="page-wrapper">
      <div className="page-hero">
        <div className="page-hero-content">
          <h2 className="page-hero-title">文化典藏</h2>
          <p className="page-hero-en">Cultural Heritage</p>
          <p className="page-hero-desc">玉之五德，承载千年文明</p>
        </div>
      </div>

      <div className="standard-layout">
        {/* ── 玉之五德 ─────────────────────────────── */}
        <section style={{ marginBottom: 'var(--space-16)' }}>
          <div className="section-head">
            <div className="title-row">
              <span className="title-ornament" />
              <h2 className="section-title">玉之五德</h2>
              <span className="title-ornament" />
            </div>
            <p className="section-en">Five Virtues of Jade</p>
            <p className="section-desc">君子比德于玉，玉具五德</p>
          </div>

          <div className="virtue-timeline">
            {virtues.map((v, i) => (
              <div key={v.char} className="virtue-row" style={i % 2 === 0 ? {} : { direction: 'rtl' }}>
                <div style={i % 2 !== 0 ? { direction: 'ltr' } : {}}>
                  <div className="virtue-card-full">
                    <h3 style={{ color: 'var(--jade-dark)', fontSize: '1.2rem', marginBottom: '8px' }}>{v.title}</h3>
                    <p className="virtue-quote">{v.quote}</p>
                    <p className="virtue-desc">{v.desc}</p>
                  </div>
                </div>
                <div style={{ direction: 'ltr' }}>
                  <div className="virtue-big-icon">{v.char}</div>
                </div>
                <div style={i % 2 !== 0 ? { direction: 'ltr' } : {}}>
                  <div style={{ height: '100%' }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 历史沿革 ─────────────────────────────── */}
        <section style={{ marginBottom: 'var(--space-16)' }}>
          <div className="section-head">
            <div className="title-row">
              <span className="title-ornament" />
              <h2 className="section-title">历史沿革</h2>
              <span className="title-ornament" />
            </div>
            <p className="section-en">Historical Evolution</p>
            <p className="section-desc">七千年玉文化，薪火相传</p>
          </div>

          <div className="history-timeline">
            {history.map((item, i) => (
              <div key={i} className="history-item">
                {i % 2 === 0 ? (
                  <>
                    <div className="history-card">
                      <h3 className="history-era">{item.era}</h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--gold-deep)', marginBottom: '6px', fontFamily: 'var(--font-display)' }}>
                        {item.period}
                      </p>
                      <p className="history-desc">{item.desc}</p>
                    </div>
                    <div className="history-dot">{i + 1}</div>
                    <div />
                  </>
                ) : (
                  <>
                    <div />
                    <div className="history-dot">{i + 1}</div>
                    <div className="history-card">
                      <h3 className="history-era">{item.era}</h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--gold-deep)', marginBottom: '6px', fontFamily: 'var(--font-display)' }}>
                        {item.period}
                      </p>
                      <p className="history-desc">{item.desc}</p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── 古籍经典 ─────────────────────────────── */}
        <section style={{ marginBottom: 'var(--space-16)' }}>
          <div className="section-head">
            <div className="title-row">
              <span className="title-ornament" />
              <h2 className="section-title">古籍经典</h2>
              <span className="title-ornament" />
            </div>
            <p className="section-en">Classical Literature</p>
            <p className="section-desc">经典文献，千古玉论</p>
          </div>

          <div className="classics-grid">
            {classics.map((c, i) => (
              <div className="classic-card" key={i}>
                <h3 className="classic-title">{c.title}</h3>
                <p className="classic-quote">{c.quote}</p>
                <p className="classic-source">{c.source}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 玉言诗韵 ─────────────────────────────── */}
        <section>
          <div className="section-head">
            <div className="title-row">
              <span className="title-ornament" />
              <h2 className="section-title">玉言诗韵</h2>
              <span className="title-ornament" />
            </div>
            <p className="section-en">Jade Poetry</p>
            <p className="section-desc">诗词歌赋，玉之意境</p>
          </div>

          <div className="poetry-grid">
            {poetry.map((p, i) => (
              <div className="poem-card" key={i}>
                <h3 className="poem-title">{p.title}</h3>
                <p className="poem-lines">{p.lines.split('\n').map((line, j) => (
                  <span key={j}>{line}<br /></span>
                ))}</p>
                <p className="poem-author">{p.author}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
