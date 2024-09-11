import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Description } from '@/app/components/Description';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: 'Description',
    component: Description,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
    },
    args: {
    },
} satisfies Meta<typeof Description>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        children: `<p>
    test description
</p>`
    },
};

export const SampleDescription: Story = {
    args: {
        children: `<p>This is the story of an April Fool’s Day joke that got wildly out of control.</p><p>In 1991, a columnist for InfoWorld claimed that he learned of a hyper-advanced computer virus called “AF/91” that disabled Iraqi air defense systems during the first Gulf War. This virus had allegedly escaped Iraq and threatened every computer that used a windows-based graphical interface. The last line of the column revealed the truth: the story of the AF/91 virus was a fun bit of fiction for April 1st.</p><p>But shortly afterwards, a journalist for U.S. News &amp;amp; World Report reported on a virus that sounded suspiciously similar to AF/91, based on confirmation from two government officials. Though the report was clearly based on the joke virus from InfoWorld, the publication refused to retract. So for more than a decade the story was repeated as if it were true in newspapers, magazines, and even in a report by a major think tank.</p><p>The boys walk through the evolution of the strange tale of this virus hoax and speculate about why it spread so widely for so long.<br><br>Thanks for subscribing to QAA on patreon.</p><p>Pick up new merch! We've got a mug, a two-sided tee, a hoodie, and an embroidered hat. Each item shows off the new QAA logo by illustrator Pedro Correa.</p><p><a href="https://shopqaa.myshopify.com/" rel="nofollow noopener" target="_blank">https://shopqaa.myshopify.com/</a></p><p>Editing by Corey Klotz. Theme by Nick Sena. Additional music by Pontus Berghe. Theme Vocals by THEY/LIVE (<a href="https://instagram.com/theyylivve" rel="nofollow noopener" target="_blank">https://instagram.com/theyylivve</a> / <a href="https://sptfy.com/QrDm)." rel="nofollow noopener" target="_blank">https://sptfy.com/QrDm).</a> Cover Art by Pedro Correa: (<a href="https://pedrocorrea.com" rel="nofollow noopener" target="_blank">https://pedrocorrea.com</a>)</p><p><a href="https://qaapodcast.com" rel="nofollow noopener" target="_blank">https://qaapodcast.com</a></p><p>QAA was known as the QAnon Anonymous podcast.<br></p><p><strong>REFERENCES</strong></p><p>Meta-Virus Set to Unleash Plague on Windows 3.0 Users<br><a href="https://books.google.com/books?id=0FAEAAAAMBAJ" rel="nofollow noopener" target="_blank">https://books.google.com/books?id=0FAEAAAAMBAJ</a><br><br>Computer Virus Story Proves To Be a Twice-Told Tale<br><a href="https://www.newspapers.com/image/532416866/" rel="nofollow noopener" target="_blank">https://www.newspapers.com/image/532416866/</a><br><br>Russian Views On Electronic and Information Warfare<br><a href="https://www.esd.whs.mil/Portals/54/Documents/FOID/Reading%20Room/International_Security_Affairs/14-F-0564_DOC_01_RUSSIAN_VIEWS_ON_ELECTRONIC_AND_INFORMATION_WARFARE_vol_1.pdf" rel="nofollow noopener" target="_blank">https://www.esd.whs.mil/Portals/54/Documents/FOID/Reading%20Room/International_Security_Affairs/14-F-0564_DOC_01_RUSSIAN_VIEWS_ON_ELECTRONIC_AND_INFORMATION_WARFARE_vol_1.pdf</a><br><br>Taking a byte from Baghdad: Information War could hobble Iraq, but might become a two edged sword<br><a href="https://www.newspapers.com/image/775197909/" rel="nofollow noopener" target="_blank">https://www.newspapers.com/image/775197909/</a><br><br>One printer, one virus, one disabled Iraqi air defense<br><a href="https://www.theregister.com/2003/03/10/one_printer_one_virus_one/" rel="nofollow noopener" target="_blank">https://www.theregister.com/2003/03/10/one_printer_one_virus_one/</a><br><br>Attack Of The Trojan Printers<br><a href="https://www.infoworld.com/article/2285234/attack-of-the-trojan-printers.html" rel="nofollow noopener" target="_blank">https://www.infoworld.com/article/2285234/attack-of-the-trojan-printers.html</a></p>`
    },
};
