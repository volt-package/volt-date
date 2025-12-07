### 📋 사전 준비: 컨텍스트 설정 프롬프트

_가장 먼저 이 프롬프트를 입력하여 AI에게 프로젝트의 핵심 원칙을 주입시켜 주세요._

```markdown
당신은 시니어 JavaScript 라이브러리 아키텍트입니다.
우리는 지금부터 Day.js를 대체할 초경량 날짜 라이브러리인 'volt-date'를 개발할 것입니다.

**[핵심 원칙]**

1. **프로젝트명:** volt-date
2. **클래스명:** VDate (기존 Volt에서 변경됨)
3. **철학:** Native-First & Zero-Dependency.
   - 별도의 로케일 파일이나 타임존 데이터베이스(JSON)를 절대 사용하지 않습니다.
   - 모든 날짜 포맷팅과 타임존 계산은 브라우저 내장 API인 `Intl` 객체를 활용합니다.
4. **불변성(Immutable):** 모든 변경 메서드는 원본을 수정하지 않고 새로운 `VDate` 인스턴스를 반환합니다.
5. **호환성:** Day.js의 API 시그니처를 최대한 따릅니다.

이 원칙을 기억하고, 이어지는 단계별 구현 요청에 따라 코드를 작성해주세요.
```

---

### 🚀 Step 1. 프로젝트 스캐폴딩 및 VDate 클래스 기초

_기본적인 클래스 구조와 데이터 속성을 정의합니다._

```markdown
**[Step 1 요청]**
TypeScript 기반의 프로젝트 스캐폴딩과 `VDate` 핵심 클래스 구조를 작성해주세요.

**[요구사항]**

1. `VDate` 클래스는 다음 3가지 내부 속성(Private Properties)을 가집니다.
   - `$d`: Native Date 객체 (UTC 시간 저장)
   - `$tz`: 타임존 문자열 (기본값: `Intl.DateTimeFormat().resolvedOptions().timeZone`)
   - `$locale`: 로케일 문자열 (기본값: `navigator.language` 또는 'en-US')
2. 생성자(`constructor`)는 `date`, `config`를 인자로 받습니다.
3. `clone()` 메서드를 구현하여 불변성을 유지할 수 있는 기반을 마련하세요.
4. 유틸리티 함수 `isValid()`를 구현하세요.
5. `volt(date, config)` 팩토리 함수를 export 하세요.
```

---

### 🌐 Step 2. 타임존 투영(Projection) 기반 Getter/Setter

_가장 중요한 부분입니다. Native Date 메서드를 그대로 쓰면 안 되고, 반드시 타임존을 고려해야 합니다._

```markdown
**[Step 2 요청]**
`VDate` 클래스에 날짜 조회(Get) 및 수정(Set) 메서드를 구현해주세요.

**[구현 목록]**

- `year()`, `month()`, `date()`, `day()`, `hour()`, `minute()`, `second()`, `millisecond()`

**[핵심 요구사항 (매우 중요)]**

1. **Getter (조회):** `this.$d.getHours()`처럼 Native 메서드를 직접 사용하면 안 됩니다. 반드시 `Intl.DateTimeFormat`을 사용하여 **현재 설정된 `$tz`(타임존) 기준의 시간**을 추출해야 합니다.
   - _힌트:_ `formatToParts`를 활용하여 타임존이 적용된 시간 부품을 파싱하세요.
2. **Setter (수정):** 인자가 전달되면 값을 수정하되, **반드시 새로운 `VDate` 인스턴스를 반환**해야 합니다(Immutable).
3. **Setter 로직:** 특정 타임존에서의 시간을 변경했을 때, UTC 기준으로는 몇 시가 되는지 역산하여 `$d`를 업데이트해야 합니다.
```

---

### 🎨 Step 3. 포맷팅 (Intl 기반) & 캐싱 최적화

_데이터 파일 없이 포맷팅을 구현하는 핵심 로직입니다._

```markdown
**[Step 3 요청]**
`VDate` 클래스에 `format(formatString)` 메서드를 구현해주세요.

**[요구사항]**

1. **토큰 매핑:** `YYYY`, `MM`, `DD`, `dddd`(요일), `HH`, `mm` 등의 포맷 문자열을 정규식으로 파싱하여, `Intl.DateTimeFormat`의 옵션(`year: 'numeric'`, `weekday: 'long'` 등)으로 매핑하는 로직을 작성하세요.
2. **Native Intl 활용:** 매핑된 옵션과 `$locale`, `$tz` 정보를 사용하여 최종 문자열을 생성하세요.
3. **성능 최적화 (필수):** `Intl.DateTimeFormat` 객체 생성 비용이 비쌉니다. `locale + timezone + options`를 Key로 하는 **캐싱(Caching) 시스템**을 구현하여 성능 저하를 막으세요.
```

---

### ➕ Step 4. 날짜 조작 (Manipulation)

_날짜 더하기/빼기 및 시작/끝 지점 계산입니다._

```markdown
**[Step 4 요청]**
날짜를 조작하는 메서드를 구현해주세요. 모든 메서드는 체이닝이 가능하도록 새로운 `VDate` 인스턴스를 반환해야 합니다.

**[구현 목록]**

1. `add(value, unit)`, `subtract(value, unit)`:
   - 일(Day), 월(Month), 년(Year) 등의 단위 계산을 지원하세요.
   - **월 연산 주의:** 1월 31일에서 1달을 더하면 2월 28일(혹은 29일)이 되도록 말일 보정 로직을 포함하세요.
2. `startOf(unit)`, `endOf(unit)`:
   - 특정 단위의 시작(00:00:00)과 끝(23:59:59.999)으로 시간을 설정하세요.
   - 이 역시 현재 설정된 `$tz` 타임존을 기준으로 계산되어야 합니다.
```

---

### 🔌 Step 5. 플러그인 시스템 및 확장 기능

_Native API를 활용한 플러그인 예시입니다._

```markdown
**[Step 5 요청]**
`VDate`의 기능을 확장할 수 있는 플러그인 시스템(`extend`)과 예시 플러그인을 작성해주세요.

**[요구사항]**

1. Day.js 스타일의 `volt.extend(plugin)` 구조를 만드세요.
2. **RelativeTime 플러그인:**
   - 브라우저 내장 API인 `Intl.RelativeTimeFormat`을 사용하여 "3일 전", "방금 전" 등을 출력하는 플러그인을 구현하세요.
   - 별도의 언어 설정 파일 없이 `$locale`에 따라 자동 번역되어야 합니다.
3. **Timezone 플러그인 (Core 통합):**
   - 이미 Core에 `$tz`가 있지만, 타임존을 변경하는 `tz(timezoneId)`, `utc()`, `local()` 메서드를 명시적으로 구현하세요.
```

---

### 🧪 Step 6. 테스트 및 번들링 설정

_마지막으로 품질을 검증합니다._

```markdown
**[Step 6 요청]**
프로젝트 완성을 위해 다음 항목을 작성해주세요.

1. **Vitest 테스트 코드:**
   - 타임존 관련 테스트 케이스를 중점적으로 작성하세요 (예: 서울에서 9시는 뉴욕에서 전날 19시인가?).
   - 포맷팅이 로케일(ko-KR, en-US)에 따라 다르게 나오는지 검증하세요.
2. **인덱스 파일:** 라이브러리의 진입점(`index.ts`)을 정리해주세요.
```

