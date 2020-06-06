import * as Discord from "discord.js";

const CORRELL_IMAGES = [
    'https://pbs.twimg.com/profile_images/1226468190667984897/wb1uZA4n_400x400.jpg',
    'https://pbs.twimg.com/profile_images/1133974633848483842/1HovL_Zm_400x400.jpg',
    'https://i.kym-cdn.com/entries/icons/original/000/029/512/maxresdefault.jpg',
    'https://i.redd.it/ons9mapcfkf31.jpg',
    'https://pbs.twimg.com/media/D3cUsClUwAErFJ8.jpg',
    'https://pbs.twimg.com/media/DyXGFcRU0AEVJoy.jpg',
    'https://i.redd.it/7jhglzzjyzq21.jpg',
    'https://pbs.twimg.com/media/DsKRuTbUcAAX-4g.jpg',
    'https://66.media.tumblr.com/f3607adb5f6b6fd6f6d0ef0111ddd6d2/tumblr_pue7vm8Edv1vluw6oo1_250.gif',
    'https://pbs.twimg.com/media/EWbiJxCU0AApJPF.jpg',
    'https://pbs.twimg.com/profile_images/1133974633848483842/1HovL_Zm_400x400.jpg'
];

export default class BotUtilities {
    public getCorrell(): string{
        const imageIndex = Math.floor(Math.random() * Math.floor(CORRELL_IMAGES.length));

        return CORRELL_IMAGES[imageIndex]
    }

    public findImage(json): string {
        let imageUrl = '';
        let count = 0;

        do {
            count = count +1;
            imageUrl = this.getImageUrl(json);
            if (count === 5) {
                throw new Error('Http is bullshit.')
            }
        } while (this.isHttpUrl(imageUrl));

        return imageUrl;
    }

    private isHttpUrl(imageUrl): boolean {
        const httpArray = imageUrl.split(':');
        if (!httpArray[0].includes('https')) {
            return true;
        }

        return false;
    }

    private getRandomImage(json): string {
        const arrayLength = json.data.length;
        let index = 0;
        if (arrayLength > 1) {
            index = Math.floor(Math.random() * Math.floor(arrayLength));
        }
        let image = json.data[index];
        if (image.is_album) {
            image = this.getAlbumImage(image);
        } else {
            image = image.link;
        }
        console.log('index is ' + index);

        return image;
    }

    private getAlbumImage(image): string {
        const albumLength = image.images.length;
        const albumIndex = Math.floor(Math.random() * Math.floor(albumLength));
        console.log('album index is ' + albumIndex);
        if (image.images[albumIndex].gifv) {
            image = image.images[albumIndex].gifv;
        } else {
            image = image.images[albumIndex].link;
        }

        return image;
    }

    private cleanImageUrl(imageUrl): string {
        const imageUrlArray = imageUrl.split(".");
        const imageExtension = imageUrlArray[imageUrlArray.length - 1];
        switch (imageExtension) {
            case "gifv":
                imageUrl = imageUrl.substring(0, imageUrl.length - 1);
        }

        return imageUrl;
    }

    private getImageUrl(json): string {
        let imageUrl = this.getRandomImage(json);
        imageUrl = this.cleanImageUrl(imageUrl);

        return imageUrl;
    }
}