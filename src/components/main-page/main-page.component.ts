import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { WedCalendarComponent } from '../calendar/calendar.component';

interface FeedBackForm {
  fio: FormControl<string | null>;
  food: FormControl<string | null>;
  alco: FormControl<string[] | null>;
  allergic: FormControl<string | null>;
}
@Component({
  selector: 'wed-main-page',
  imports: [ReactiveFormsModule, WedCalendarComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})
export class WedMainPageComponent {
  form: FormGroup<FeedBackForm> = new FormGroup({
    fio: new FormControl(''),
    food: new FormControl('Нет'),
    alco: new FormControl(['']),
    allergic: new FormControl(''),
  });

  foodInfo: string[] = ['Не ем мясо', 'Не ем рыбу', 'Ем только птицу', 'Нет'];
  alcoInfo: string[] = ['Белое вино', 'Красное вино', 'Джин', 'Ром', 'Виски', 'Коньяк', 'Настойки'];

  readonly #chatId = '663118817';
  readonly #telegramApi = `https://api.telegram.org/bot7777075522:AAEm2hMQvvbG0FnnBfE9e-ZA1cytLofr41k/sendMessage`;

  faqItems = [
    {
      title: '🗓️ Ещё раз, где и когда?',
      content:
        'Наша свадьба пройдёт 22 августа в резиденции Мария. Начало в 16:00. Да, лучше приехать заранее, чем опоздать',
      expanded: false,
    },
    {
      title: '🎁 А что дарить?',
      content: 'Для нас лучший подарок это осуществление мечты. А мечты стоят дорого.',
      expanded: false,
    },
    {
      title: '💐 А цветы?',
      content:
        'Вместо букета в качестве презента мы будем рады бутылке вина или другого алкоголя, которую мы откроем на ближайшем семейном празднике',
      expanded: false,
    },
    {
      title: '👶 Можно ли с детьми?',
      content:
        'Будем предельно благодарны, если всё ваше внимание будет приковано к нам, а за детками присмотрят те, кому вы доверяете',
      expanded: false,
    },
    {
      title: '📞 Если возникли вопросы?',
      content:
        'Свяжитесь с Денисом или Каролиной любым удобным способом или перечитайте пригласительное',
      expanded: false,
    },
  ];

  constructor(private http: HttpClient) {}

  toggleItem(index: number) {
    this.faqItems[index].expanded = !this.faqItems[index].expanded;
  }

  onAlcoChange(event: any) {
    const alcoValue = event.target.value;
    const currentAlco = this.form.get('alco')?.value || [];

    if (event.target.checked) {
      this.form.patchValue({
        alco: [...currentAlco.filter((item) => item), alcoValue],
      });
    } else {
      this.form.patchValue({
        alco: currentAlco.filter((item: string) => item && item !== alcoValue),
      });
    }
  }

  isAlcoSelected(alco: string): boolean {
    const currentAlco = this.form.get('alco')?.value || [];
    return currentAlco.includes(alco);
  }

  sendToTelegram() {
    const message = `
📋 Новая заявка с сайта:
👤 Имя: ${this.form.value.fio || 'не указано'}
🍽️ Еда: ${this.form.value.food || 'не указано'}
⚠️ Аллергии: ${this.form.value.allergic || 'нет'}
🥂 Алкоголь: ${this.form.value.alco?.join(', ') || 'не указан'}
  `;

    const body = {
      chat_id: this.#chatId,
      text: message,
      parse_mode: 'HTML',
    };

    this.http.post(this.#telegramApi, body).subscribe(
      (ok) => {
        alert('Спасибо! Мы получили ваш ответ ❤️');
        this.form.reset({
          fio: '',
          food: 'Нет',
          alco: [],
          allergic: '',
        });
      },
      (err) => {
        console.error('Ошибка:', err);
        alert('Ошибка. Проверьте консоль');
      },
    );
  }
}
